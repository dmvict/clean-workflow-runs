
const core = require( '@actions/core' );
const action = require( './Lib.js' );

//

async function run()
{
  debugger;
  const options = action.actionOptionsGet();
  const runs = await action.workflowRunsGet( options );
  const filtered = action.workflowRunsFilter( runs, options );
  return action.workflowRunsClean( filtered, options );
}

run()
.then( ( e ) =>
{
  return e;
})
.catch( ( err ) =>
{
  core.setFailed( err.message );
});
