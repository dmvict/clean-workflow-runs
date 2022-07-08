
'use strict';

const core = require( '@actions/core' );
const { Octokit } = require( '@octokit/rest' );
let octokit = null;

//

function actionOptionsGet()
{
  let token = core.getInput( 'token' );
  if( !token )
  token = process.env.GITHUB_TOKEN;
  if( !token )
  throw Error( 'Expects token. Please add field `token` or set environment variable `GITHUB_TOKEN`.' );

  let repoRef = core.getInput( 'repo' );
  if( !repoRef )
  repoRef = process.env.GITHUB_REPOSITORY;
  if( !repoRef )
  throw Error( 'Expects repo in format {owner}/{repo_name}. Please add field `repo`.' );

  const splits = repoRef.split( '/' );
  const owner = splits[ 0 ];
  const repo = splits[ 1 ];
  if( !owner || !repo || splits.length > 2 )
  throw Error( 'Expects repo in format {owner}/{repo_name}. Please add field `repo`.' );

  let workflowId = core.getInput( 'workflow_id' );
  if( workflowId && /^\d+$/.test( workflowId ) )
  workflowId = Number( workflowId );
  const branch = core.getInput( 'branch' );
  let conclusions = core.getMultilineInput( 'run_conclusions' );
  if( conclusions.length === 1 )
  conclusions = conclusions[ 0 ].split( ',' )
  .map( ( v ) => v.trim() )
  .filter( ( v ) => v !== '' );

  const savePeriod = timeParse( core.getInput( 'save_period' ) || 90 );
  let saveMinRunsNumber = core.getInput( 'save_min_runs_number' );
  if( saveMinRunsNumber )
  saveMinRunsNumber = Number( saveMinRunsNumber );
  if( saveMinRunsNumber || saveMinRunsNumber === 0 )
  saveMinRunsNumber = Math.ceil( saveMinRunsNumber );
  else
  saveMinRunsNumber = 10;
  const dry = core.getInput( 'dry' ).trim() === 'true';

  const options =
  {
    token,
    owner,
    repo,
    workflowId,
    branch,
    conclusions,
    savePeriod,
    saveMinRunsNumber,
    dry,
  };

  return options;
}

//

function timeParse( src )
{
  if( !isNaN( Number( src ) ) )
  return src * 86400000;

  if( typeof( src ) !== 'string' )
  throw Error( 'Unsupported time type. Please, set number of days as number or time in format "hh:mm:ss".' );

  const parts = src.trim().split( ':' );
  if( parts.length !== 3 )
  throw Error( 'Unsupported time format. Please set time in format: "hh:mm:ss"' );

  const hours = Number( parts[ 0 ] );
  const days = Math.trunc( hours / 24 );

  let baseDelta = 86400000 * days;
  parts[ 0 ] = hours - ( days * 24 );
  const result = baseDelta + Date.parse( `01 Jan 1970 ${ parts.join( ':' ) } GMT` );
  if( isNaN( result ) )
  throw Error( 'Wrong time format.' )

  return result;
}

//

async function workflowRunsGet( options )
{
  octokit = new Octokit({ auth: options.token });

  let result = [];
  let runs = null;

  let listWorkflowRunsRoutine = octokit.actions.listWorkflowRunsForRepo;
  const opts =
  {
    owner : options.owner,
    repo : options.repo,
    branch : options.branch,
    per_page: 100,
    page : 1,
  };
  if( options.workflowId )
  {
    opts.workflow_id = options.workflowId;
    listWorkflowRunsRoutine = octokit.actions.listWorkflowRuns;
  }

  do
  {
    const response = await listWorkflowRunsRoutine( opts );
    runs = response.data.workflow_runs;
    result.push( ... runs );
    opts.page++;
  }
  while( runs.length === 100 )

  return result;
}

//

function workflowRunsFilter( runs, options )
{
  let result = runs.filter( ( e ) => e.status === 'completed' );

  if( options.conclusions && options.conclusions.length )
  result = result.filter( ( e ) => options.conclusions.includes( e.conclusion ) );

  let saveMinRunsNumber = options.saveMinRunsNumber;
  if( !saveMinRunsNumber || typeof saveMinRunsNumber !== 'number' )
  saveMinRunsNumber = 0;

  let savePeriod = Date.now() - options.savePeriod;
  result = result.filter( ( e ) =>
  {
    if( Date.parse( e.updated_at ) < savePeriod )
    return true;
    saveMinRunsNumber -= 1;
    return false;
  });

  if( saveMinRunsNumber > 0 )
  result.splice( 0, options.saveMinRunsNumber );

  return result;
}

//

async function workflowRunsClean( runs, options )
{
  if( octokit === null )
  octokit = new Octokit({ auth: options.token });

  if( options.dry )
  for( let i = 0 ; i < runs.length ; i++ )
  {
    const run_id = runs[ i ].id;
    core.info( `Deleting workflow run::#${ run_id } commit message::"${ runs[ i ].head_commit.message }"` );
  }
  else
  for( let i = 0 ; i < runs.length ; i++ )
  {
    const run_id = runs[ i ].id;
    core.info( `Deleting workflow run::#${ run_id } commit message::"${ runs[ i ].head_commit.message }"` );
    await octokit.actions.deleteWorkflowRun
    ({
      owner : options.owner,
      repo : options.repo,
      run_id,
    });
  }
}

//

const Self =
{
  actionOptionsGet,
  timeParse,
  workflowRunsGet,
  workflowRunsFilter,
  workflowRunsClean,
};

//

module.exports = Self;
