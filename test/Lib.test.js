
'use strict';

const _ = require( 'wTesting' );
const core = require( '@actions/core' );
const action = require( '../src/Lib.js' );

//--
// tests
//--

function actionOptionsGet( test )
{
  /* cleanup environments */
  delete process.env.INPUT_TOKEN;
  delete process.env.INPUT_REPO;
  delete process.env.INPUT_BRANCH;
  delete process.env.INPUT_DRY;
  delete process.env.INPUT_RUN_CONCLUSIONS;
  delete process.env.INPUT_SAVE_MIN_RUNS_NUMBER;
  delete process.env.INPUT_SAVE_PERIOD;

  const originalToken = process.env.GITHUB_TOKEN;
  const originalRepo = process.env.GITHUB_REPOSITORY;
  const originalBranch = process.env.GITHUB_REF;

  process.env.GITHUB_TOKEN = 'abc';
  process.env.GITHUB_REPOSITORY = 'user/repo';
  process.env.GITHUB_REF = 'custom';

  /* - */

  test.case = 'all default except save_period, save_period - number of days';
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'abc',
    owner : 'user',
    repo : 'repo',
    branch : '',
    conclusions : [],
    savePeriod : 7776000000,
    saveMinRunsNumber : 10,
    dry : false,
  };
  test.identical( got, exp );

  test.case = 'all default except save_period, save_period - number of days';
  core.exportVariable( `INPUT_SAVE_PERIOD`, 1 );
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'abc',
    owner : 'user',
    repo : 'repo',
    branch : '',
    conclusions : [],
    savePeriod : 86400000,
    saveMinRunsNumber : 10,
    dry : false,
  };
  test.identical( got, exp );
  delete process.env.INPUT_SAVE_PERIOD;

  test.case = 'all default except save_period, save_period - time';
  core.exportVariable( `INPUT_SAVE_PERIOD`, '01:00:00' );
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'abc',
    owner : 'user',
    repo : 'repo',
    branch : '',
    conclusions : [],
    savePeriod : 3600000,
    saveMinRunsNumber : 10,
    dry : false,
  };
  test.identical( got, exp );
  delete process.env.INPUT_SAVE_PERIOD;

  /* */

  test.case = 'not default token';
  core.exportVariable( `INPUT_TOKEN`, 'bar' );
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'bar',
    owner : 'user',
    repo : 'repo',
    branch : '',
    conclusions : [],
    savePeriod : 7776000000,
    saveMinRunsNumber : 10,
    dry : false,
  };
  test.identical( got, exp );
  delete process.env.INPUT_TOKEN;

  test.case = 'not default repo';
  core.exportVariable( `INPUT_REPO`, 'some-user/repository' );
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'abc',
    owner : 'some-user',
    repo : 'repository',
    branch : '',
    conclusions : [],
    savePeriod : 7776000000,
    saveMinRunsNumber : 10,
    dry : false,
  };
  test.identical( got, exp );
  delete process.env.INPUT_REPO;

  test.case = 'not default branch';
  core.exportVariable( `INPUT_BRANCH`, 'complex/branch' );
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'abc',
    owner : 'user',
    repo : 'repo',
    branch : 'complex/branch',
    conclusions : [],
    savePeriod : 7776000000,
    saveMinRunsNumber : 10,
    dry : false,
  };
  test.identical( got, exp );
  delete process.env.INPUT_BRANCH;

  /* */

  test.case = 'not default conclusions, single item';
  core.exportVariable( `INPUT_RUN_CONCLUSIONS`, 'one' );
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'abc',
    owner : 'user',
    repo : 'repo',
    branch : '',
    conclusions : [ 'one' ],
    savePeriod : 7776000000,
    saveMinRunsNumber : 10,
    dry : false,
  };
  test.identical( got, exp );
  delete process.env.INPUT_RUN_CONCLUSIONS;

  test.case = 'not default conclusions, several item';
  core.exportVariable( `INPUT_RUN_CONCLUSIONS`, 'one\ntwo' );
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'abc',
    owner : 'user',
    repo : 'repo',
    branch : '',
    conclusions : [ 'one', 'two' ],
    savePeriod : 7776000000,
    saveMinRunsNumber : 10,
    dry : false,
  };
  test.identical( got, exp );
  delete process.env.INPUT_RUN_CONCLUSIONS;

  /* */

  test.case = 'not default save_min_runs_number, invalid';
  core.exportVariable( `INPUT_SAVE_MIN_RUNS_NUMBER`, 'abc' );
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'abc',
    owner : 'user',
    repo : 'repo',
    branch : '',
    conclusions : [],
    savePeriod : 7776000000,
    saveMinRunsNumber : 10,
    dry : false,
  };
  test.identical( got, exp );
  delete process.env.INPUT_SAVE_MIN_RUNS_NUMBER;

  test.case = 'not default save_min_runs_number, integer';
  core.exportVariable( `INPUT_SAVE_MIN_RUNS_NUMBER`, 1 );
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'abc',
    owner : 'user',
    repo : 'repo',
    branch : '',
    conclusions : [],
    savePeriod : 7776000000,
    saveMinRunsNumber : 1,
    dry : false,
  };
  test.identical( got, exp );
  delete process.env.INPUT_SAVE_MIN_RUNS_NUMBER;

  test.case = 'not default save_min_runs_number, double';
  core.exportVariable( `INPUT_SAVE_MIN_RUNS_NUMBER`, 1.1 );
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'abc',
    owner : 'user',
    repo : 'repo',
    branch : '',
    conclusions : [],
    savePeriod : 7776000000,
    saveMinRunsNumber : 2,
    dry : false,
  };
  test.identical( got, exp );
  delete process.env.INPUT_SAVE_MIN_RUNS_NUMBER;

  /* */

  test.case = 'not default dry, invalid';
  core.exportVariable( `INPUT_DRY`, 'some' );
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'abc',
    owner : 'user',
    repo : 'repo',
    branch : '',
    conclusions : [],
    savePeriod : 7776000000,
    saveMinRunsNumber : 10,
    dry : false,
  };
  test.identical( got, exp );
  delete process.env.INPUT_DRY;

  test.case = 'not default dry, true';
  core.exportVariable( `INPUT_DRY`, 'true' );
  var got = action.actionOptionsGet();
  var exp =
  {
    token : 'abc',
    owner : 'user',
    repo : 'repo',
    branch : '',
    conclusions : [],
    savePeriod : 7776000000,
    saveMinRunsNumber : 10,
    dry : true,
  };
  test.identical( got, exp );
  delete process.env.INPUT_DRY;

  /* - */

  if( Config.debug )
  {
    test.case = 'no token, no repo, no branch, no environments';
    delete process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_REPOSITORY;
    delete process.env.GITHUB_REF;
    test.shouldThrowErrorSync( () => action.actionOptionsGet() );

    test.case = 'no token';
    delete process.env.GITHUB_TOKEN;
    process.env.GITHUB_REPOSITORY = 'user/branch';
    process.env.GITHUB_REF = '';
    test.shouldThrowErrorSync( () => action.actionOptionsGet() );

    test.case = 'no repo';
    process.env.GITHUB_TOKEN = 'abc';
    delete process.env.GITHUB_REPOSITORY;
    process.env.GITHUB_REF = '';
    test.shouldThrowErrorSync( () => action.actionOptionsGet() );

    test.case = 'invalid repo format';
    process.env.GITHUB_TOKEN = 'abc';
    process.env.GITHUB_REF = '';
    process.env.GITHUB_REPOSITORY = 'user';
    test.shouldThrowErrorSync( () => action.actionOptionsGet() );
    process.env.GITHUB_REPOSITORY = 'user:repo';
    test.shouldThrowErrorSync( () => action.actionOptionsGet() );
    process.env.GITHUB_REPOSITORY = 'user/';
    test.shouldThrowErrorSync( () => action.actionOptionsGet() );
    process.env.GITHUB_REPOSITORY = '/repo';
    test.shouldThrowErrorSync( () => action.actionOptionsGet() );
    process.env.GITHUB_REPOSITORY = 'user/repo/';
    test.shouldThrowErrorSync( () => action.actionOptionsGet() );
    process.env.GITHUB_REPOSITORY = 'user/repo/sub';
    test.shouldThrowErrorSync( () => action.actionOptionsGet() );
  }

  /* */

  process.env.GITHUB_TOKEN = originalToken;
  process.env.GITHUB_REPOSITORY = originalRepo;
  process.env.GITHUB_REF = originalBranch;
}

//

function timeParse( test )
{
  test.case = 'src - number, integer';
  var got = action.timeParse( 1 );
  test.identical( got, 86400000 );

  test.case = 'src - number, double';
  var got = action.timeParse( 1.5 );
  test.identical( got, 1.5 * 86400000 );

  /* */

  test.case = 'src - string, integer like';
  var got = action.timeParse( '1' );
  test.identical( got, 86400000 );

  test.case = 'src - string, double like';
  var got = action.timeParse( '1.5' );
  test.identical( got, 1.5 * 86400000 );

  test.case = 'src - string, empty';
  var got = action.timeParse( '' );
  test.identical( got, 0 );

  test.case = 'src - null';
  var got = action.timeParse( null );
  test.identical( got, 0 );

  test.case = 'src - empty array';
  var got = action.timeParse( [] );
  test.identical( got, 0 );

  test.case = 'src - single element, number like';
  var got = action.timeParse( [ '1' ] );
  test.identical( got, 86400000 );

  /* - */

  if( !Config.debug )
  return;

  test.case = 'src - wrong type of src';
  test.shouldThrowErrorSync( () => action.timeParse( undefined ) );
  test.shouldThrowErrorSync( () => action.timeParse( [ 'a' ] ) );
  test.shouldThrowErrorSync( () => action.timeParse( [ 1, 2 ] ) );
}

//

function workflowRunsGet( test )
{
  const token = process.env.PRIVATE_TOKEN;
  if( !token )
  return test.true( true );

  const a = test.assetFor( false );
  const owner = 'dmvict';
  const repo = 'clean-workflow-runs-test';

  /* */

  a.ready.then( () => action.workflowRunsGet({ token, owner, repo }) );
  a.ready.then( ( op ) =>
  {
    test.case = 'public repository, no branch';
    test.identical( op.length, 212 );
    test.identical( op[ 0 ].name, 'TimedOut' );
    test.identical( op[ 1 ].name, 'TimedOut' );
    for( let i = 2 ; i < 12 ; i++ )
    test.identical( op[ i ].name, 'Cancel' );
    for( let i = 12 ; i < 62 ; i++ )
    test.identical( op[ i ].name, 'Conditional' );
    for( let i = 62 ; i < 112 ; i++ )
    test.identical( op[ i ].name, 'Skip' );
    for( let i = 112 ; i < 212 ; i++ )
    test.identical( op[ i ].name, 'Conditional' );
    return null;
  });

  /* */

  a.ready.then( () => action.workflowRunsGet({ token, owner, repo, branch : '' }) );
  a.ready.then( ( op ) =>
  {
    test.case = 'public repository, branch - empty string';
    test.identical( op.length, 212 );
    test.identical( op[ 0 ].name, 'TimedOut' );
    test.identical( op[ 1 ].name, 'TimedOut' );
    for( let i = 2 ; i < 12 ; i++ )
    test.identical( op[ i ].name, 'Cancel' );
    for( let i = 12 ; i < 62 ; i++ )
    test.identical( op[ i ].name, 'Conditional' );
    for( let i = 62 ; i < 112 ; i++ )
    test.identical( op[ i ].name, 'Skip' );
    for( let i = 112 ; i < 212 ; i++ )
    test.identical( op[ i ].name, 'Conditional' );
    return null;
  });

  /* */

  a.ready.then( () => action.workflowRunsGet({ token, owner, repo, branch : 'master' }) );
  a.ready.then( ( op ) =>
  {
    test.case = 'public repository, explicitly defined branch, default branch';
    test.identical( op.length, 162 );
    test.identical( op[ 0 ].name, 'TimedOut' );
    test.identical( op[ 1 ].name, 'TimedOut' );
    for( let i = 2 ; i < 12 ; i++ )
    test.identical( op[ i ].name, 'Cancel' );
    for( let i = 12 ; i < 62 ; i++ )
    test.identical( op[ i ].name, 'Conditional' );
    for( let i = 62 ; i < 112 ; i++ )
    test.identical( op[ i ].name, 'Skip' );
    for( let i = 112 ; i < 162 ; i++ )
    test.identical( op[ i ].name, 'Conditional' );
    return null;
  });

  /* */

  a.ready.then( () => action.workflowRunsGet({ token, owner, repo, branch : 'less_than_100' }) );
  a.ready.then( ( op ) =>
  {
    test.case = 'public repository, default branch';
    test.identical( op.length, 50 );
    for( let i = 0 ; i < 50 ; i++ )
    test.identical( op[ i ].name, 'Conditional' );
    return null;
  });

  /* */

  a.ready.then( () => action.workflowRunsGet({ token, owner, repo, branch : 'zero_runs' }) );
  a.ready.then( ( op ) =>
  {
    test.case = 'public repository, default branch';
    test.identical( op.length, 0 );
    return null;
  });

  /* - */

  return a.ready;
}

workflowRunsGet.timeOut = 60000;

//

function workflowRunsFilter( test )
{
  const a = test.assetFor( false );
  const runs = a.fileProvider.fileReadUnknown( a.abs( __dirname, 'assets/runs.json' ) );

  /* */

  test.case = 'filter by only time, save no runs';
  var options = { savePeriod : 0, saveMinRunsNumber : 0 };
  var got = action.workflowRunsFilter( runs, options );
  test.identical( got[ 0 ].name, 'TimedOut' );
  test.identical( got, runs );
  test.true( got !== runs );

  test.case = 'filter by only time, too long save period - 10 years';
  var options = { savePeriod : 3652 * 86400000, saveMinRunsNumber : 0 };
  var got = action.workflowRunsFilter( runs, options );
  test.identical( got, [] );
  test.true( got !== runs );

  /* */

  test.case = 'filter by only conclusions, conclusions - empty array';
  var options = { savePeriod : 0, saveMinRunsNumber : 0, conclusions : [] };
  var got = action.workflowRunsFilter( runs, options );
  test.identical( got[ 0 ].name, 'TimedOut' );
  test.identical( got, runs );
  test.true( got !== runs );

  test.case = 'filter by only conclusions, invalid conclusions - delete nothing';
  var options = { savePeriod : 0, saveMinRunsNumber : 0, conclusions : [ 'invalid' ] };
  var got = action.workflowRunsFilter( runs, options );
  test.identical( got, [] );
  test.true( got !== runs );

  test.case = 'filter by only conclusions, valid conclusions - single conclusion - delete runs';
  var options = { savePeriod : 0, saveMinRunsNumber : 0, conclusions : [ 'success' ] };
  var got = action.workflowRunsFilter( runs, options );
  test.identical( got.length, 100 );
  test.true( got !== runs );

  test.case = 'filter by only conclusions, valid conclusions - several conclusions - delete runs';
  var options = { savePeriod : 0, saveMinRunsNumber : 0, conclusions : [ 'success', 'skipped' ] };
  var got = action.workflowRunsFilter( runs, options );
  test.identical( got.length, 125 );
  test.true( got !== runs );

  /* */

  test.case = 'get all runs, not zero save runs';
  var options = { savePeriod : 0, saveMinRunsNumber : 10, conclusions : [] };
  var got = action.workflowRunsFilter( runs, options );
  var exp = action.workflowRunsFilter( runs, { savePeriod : 0, saveMinRunsNumber : 0, conclusions : [] } )
  exp.splice( 0, 10 );
  test.identical( got, exp );
  test.identical( got[ 0 ].name, 'Cancel' );
  test.true( got !== runs );

  test.case = 'get runs by conclusions, non zero save runs';
  var options = { savePeriod : 0, saveMinRunsNumber : 10, conclusions : [ 'success', 'skipped' ] };
  var got = action.workflowRunsFilter( runs, options );
  var exp = action.workflowRunsFilter( runs, { savePeriod : 0, saveMinRunsNumber : 0, conclusions : [ 'success', 'skipped' ] } )
  exp.splice( 0, 10 );
  test.identical( got, exp );
  test.true( got !== runs );
}

//

function workflowRunsClean( test )
{
  const token = process.env.PRIVATE_TOKEN;
  if( !token )
  return test.true( true );

  const a = test.assetFor( false );
  const owner = 'dmvict';
  const repo = 'clean-workflow-runs-test';
  const runs = a.fileProvider.fileReadUnknown( a.abs( __dirname, 'assets/runs.json' ) );

  /* - */

  a.ready.then( () => action.workflowRunsClean( runs, { token, owner, repo, dry : true } ) );
  a.ready.then( ( op ) =>
  {
    test.identical( runs.length, 212 );
    test.identical( op, null );
    return null
  });
  a.ready.then( () => action.workflowRunsGet({ token, owner, repo }) );
  a.ready.then( ( op ) =>
  {
    test.case = 'public repository, no branch';
    test.identical( op.length, 212 );
    return null;
  });

  /* - */

  return a.ready;
}

// --
// declare
// --

const Proto =
{
  name : 'Lib',
  silencing : 1,
  enabled : 1,

  tests :
  {
    actionOptionsGet,
    timeParse,
    workflowRunsGet,
    workflowRunsFilter,
    workflowRunsClean,
  },
};

const Self = wTestSuite( Proto );
if( typeof module !== 'undefined' && !module.parent )
wTester.test( Self.name );
