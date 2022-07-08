
'use strict';

const _ = require( 'wTesting' );
const core = require( '@actions/core' );
const action = require( '../src/Lib.js' );

//--
// tests
//--

function run( test )
{
  const token = process.env.PRIVATE_TOKEN;
  if( !token )
  return test.true( true );

  const a = test.assetFor( false );
  const actionPath = a.abs( __dirname, '..' );
  const execPath = `node ${ a.path.nativize( a.abs( actionPath, 'src/Main.js' ) ) }`;
  const repo = 'dmvict/clean-workflow-runs-test';
  const shellNewLineSymbol = process.platform === 'win32' ? '\r\n' : '\n';

  /* - */

  a.ready.then( () =>
  {
    test.case = 'too big save period, 10 years, nothing to delete';
    core.exportVariable( `INPUT_TOKEN`, token );
    core.exportVariable( `INPUT_REPO`, repo );
    core.exportVariable( `INPUT_DRY`, true );
    core.exportVariable( `INPUT_SAVE_PERIOD`, 3652 );
    return null;
  });

  a.shellNonThrowing({ currentPath : actionPath, execPath });
  a.ready.then( ( op ) =>
  {
    test.identical( op.exitCode, 0 );
    const output =
    `\n================================${ shellNewLineSymbol }`
    + `Selected 0 run(s).${ shellNewLineSymbol }`
    + `================================${ shellNewLineSymbol }`
    + `\n================================${ shellNewLineSymbol }`
    + `Deleted 0 run(s) due to dry run.${ shellNewLineSymbol }`
    + `================================${ shellNewLineSymbol }`;
    test.identical( op.output, output );
    return null;
  });

  /* */

  a.ready.then( () =>
  {
    test.case = 'save period - 0, delete all exept save runs';
    core.exportVariable( `INPUT_TOKEN`, token );
    core.exportVariable( `INPUT_REPO`, repo );
    core.exportVariable( `INPUT_DRY`, true );
    core.exportVariable( `INPUT_SAVE_PERIOD`, 0 );
    return null;
  });

  a.shellNonThrowing({ currentPath : actionPath, execPath });
  a.ready.then( ( op ) =>
  {
    test.identical( op.exitCode, 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Cancel\`\"/ ), 2 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Skip\`\"/ ), 100 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Init\"/ ), 100 );
    test.identical( _.strCount( op.output, 'Selected 202 run(s):' ), 1 );
    test.identical( _.strCount( op.output, 'Deleted 0 run(s) due to dry run.' ), 1 );

    return null;
  });

  /* */

  a.ready.then( () =>
  {
    test.case = 'too big save period, 10 years, nothing to delete';
    core.exportVariable( `INPUT_TOKEN`, token );
    core.exportVariable( `INPUT_REPO`, repo );
    core.exportVariable( `INPUT_DRY`, true );
    core.exportVariable( `INPUT_SAVE_PERIOD`, '87672:00:00' );
    return null;
  });

  a.shellNonThrowing({ currentPath : actionPath, execPath });
  a.ready.then( ( op ) =>
  {
    test.identical( op.exitCode, 0 );
    const output =
    `\n================================${ shellNewLineSymbol }`
    + `Selected 0 run(s).${ shellNewLineSymbol }`
    + `================================${ shellNewLineSymbol }`
    + `\n================================${ shellNewLineSymbol }`
    + `Deleted 0 run(s) due to dry run.${ shellNewLineSymbol }`
    + `================================${ shellNewLineSymbol }`;
    test.identical( op.output, output );
    return null;
  });

  /* */

  a.ready.then( () =>
  {
    test.case = 'save period - 15 hours, delete all exept save runs';
    core.exportVariable( `INPUT_TOKEN`, token );
    core.exportVariable( `INPUT_REPO`, repo );
    core.exportVariable( `INPUT_DRY`, true );
    core.exportVariable( `INPUT_SAVE_PERIOD`, '15:00:00' );
    return null;
  });

  a.shellNonThrowing({ currentPath : actionPath, execPath });
  a.ready.then( ( op ) =>
  {
    test.identical( op.exitCode, 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Cancel\`\"/ ), 2 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Skip\`\"/ ), 100 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Init\"/ ), 100 );
    test.identical( _.strCount( op.output, 'Selected 202 run(s):' ), 1 );
    test.identical( _.strCount( op.output, 'Deleted 0 run(s) due to dry run.' ), 1 );
    return null;
  });

  /* */

  a.ready.then( () =>
  {
    test.case = 'save period - 0, save min runs - 0, delete all';
    core.exportVariable( `INPUT_TOKEN`, token );
    core.exportVariable( `INPUT_REPO`, repo );
    core.exportVariable( `INPUT_DRY`, true );
    core.exportVariable( `INPUT_SAVE_PERIOD`, 0 );
    core.exportVariable( `INPUT_SAVE_MIN_RUNS_NUMBER`, 0 );
    return null;
  });

  a.shellNonThrowing({ currentPath : actionPath, execPath });
  a.ready.then( ( op ) =>
  {
    test.identical( op.exitCode, 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`TimedOut\`\"/ ), 2 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Cancel\`\"/ ), 10 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Skip\`\"/ ), 100 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Init\"/ ), 100 );
    test.identical( _.strCount( op.output, 'Selected 212 run(s):' ), 1 );
    test.identical( _.strCount( op.output, 'Deleted 0 run(s) due to dry run.' ), 1 );
    return null;
  });

  /* */

  a.ready.then( () =>
  {
    test.case = 'save period - 0, save min runs - 0, branch - master, delete all';
    core.exportVariable( `INPUT_TOKEN`, token );
    core.exportVariable( `INPUT_REPO`, repo );
    core.exportVariable( `INPUT_DRY`, true );
    core.exportVariable( `INPUT_BRANCH`, 'master' );
    core.exportVariable( `INPUT_SAVE_PERIOD`, 0 );
    core.exportVariable( `INPUT_SAVE_MIN_RUNS_NUMBER`, 0 );
    return null;
  });

  a.shellNonThrowing({ currentPath : actionPath, execPath });
  a.ready.then( ( op ) =>
  {
    test.identical( op.exitCode, 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`TimedOut\`\"/ ), 2 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Cancel\`\"/ ), 10 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Skip\`\"/ ), 100 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Init\"/ ), 50 );
    test.identical( _.strCount( op.output, 'Selected 162 run(s):' ), 1 );
    test.identical( _.strCount( op.output, 'Deleted 0 run(s) due to dry run.' ), 1 );
    return null;
  });

  /* */

  a.ready.then( () =>
  {
    test.case = 'save period - 0, save min runs - 0, branch - master, conclusions - invalid string, delete all';
    core.exportVariable( `INPUT_TOKEN`, token );
    core.exportVariable( `INPUT_REPO`, repo );
    core.exportVariable( `INPUT_DRY`, true );
    core.exportVariable( `INPUT_BRANCH`, 'master' );
    core.exportVariable( `INPUT_SAVE_PERIOD`, 0 );
    core.exportVariable( `INPUT_SAVE_MIN_RUNS_NUMBER`, 0 );
    core.exportVariable( `INPUT_RUN_CONCLUSIONS`, 'invalid' );
    return null;
  });

  a.shellNonThrowing({ currentPath : actionPath, execPath });
  a.ready.then( ( op ) =>
  {
    test.identical( op.exitCode, 0 );
    const output =
    `\n================================${ shellNewLineSymbol }`
    + `Selected 0 run(s).${ shellNewLineSymbol }`
    + `================================${ shellNewLineSymbol }`
    + `\n================================${ shellNewLineSymbol }`
    + `Deleted 0 run(s) due to dry run.${ shellNewLineSymbol }`
    + `================================${ shellNewLineSymbol }`;
    test.identical( op.output, output );
    return null;
  });

  /* */

  a.ready.then( () =>
  {
    test.case = 'save period - 0, save min runs - 0, branch - master, conclusions - valid string, delete all';
    core.exportVariable( `INPUT_TOKEN`, token );
    core.exportVariable( `INPUT_REPO`, repo );
    core.exportVariable( `INPUT_DRY`, true );
    core.exportVariable( `INPUT_BRANCH`, 'master' );
    core.exportVariable( `INPUT_SAVE_PERIOD`, 0 );
    core.exportVariable( `INPUT_SAVE_MIN_RUNS_NUMBER`, 0 );
    core.exportVariable( `INPUT_RUN_CONCLUSIONS`, 'skipped' );
    return null;
  });

  a.shellNonThrowing({ currentPath : actionPath, execPath });
  a.ready.then( ( op ) =>
  {
    test.identical( op.exitCode, 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`TimedOut\`\"/ ), 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Cancel\`\"/ ), 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Skip\`\"/ ), 25 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Init\"/ ), 0 );
    test.identical( _.strCount( op.output, 'Selected 25 run(s):' ), 1 );
    test.identical( _.strCount( op.output, 'Deleted 0 run(s) due to dry run.' ), 1 );
    return null;
  });

  /* */

  a.ready.then( () =>
  {
    test.case = 'save period - 0, save min runs - 0, branch - master, conclusions - valid multiline string, delete all';
    core.exportVariable( `INPUT_TOKEN`, token );
    core.exportVariable( `INPUT_REPO`, repo );
    core.exportVariable( `INPUT_DRY`, true );
    core.exportVariable( `INPUT_BRANCH`, 'master' );
    core.exportVariable( `INPUT_SAVE_PERIOD`, 0 );
    core.exportVariable( `INPUT_SAVE_MIN_RUNS_NUMBER`, 0 );
    core.exportVariable( `INPUT_RUN_CONCLUSIONS`, 'skipped\ncancelled' );
    return null;
  });

  a.shellNonThrowing({ currentPath : actionPath, execPath });
  a.ready.then( ( op ) =>
  {
    test.identical( op.exitCode, 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`TimedOut\`\"/ ), 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Cancel\`\"/ ), 10 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Skip\`\"/ ), 25 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Init\"/ ), 0 );
    test.identical( _.strCount( op.output, 'Selected 35 run(s):' ), 1 );
    test.identical( _.strCount( op.output, 'Deleted 0 run(s) due to dry run.' ), 1 );
    return null;
  });

  /* */

  a.ready.then( () =>
  {
    test.case = 'save period - 0, save min runs - 0, branch - master, conclusions - singleline string with commas, delete all';
    core.exportVariable( `INPUT_TOKEN`, token );
    core.exportVariable( `INPUT_REPO`, repo );
    core.exportVariable( `INPUT_DRY`, true );
    core.exportVariable( `INPUT_BRANCH`, 'master' );
    core.exportVariable( `INPUT_SAVE_PERIOD`, 0 );
    core.exportVariable( `INPUT_SAVE_MIN_RUNS_NUMBER`, 0 );
    core.exportVariable( `INPUT_RUN_CONCLUSIONS`, 'skipped,cancelled,' );
    return null;
  });

  a.shellNonThrowing({ currentPath : actionPath, execPath });
  a.ready.then( ( op ) =>
  {
    test.identical( op.exitCode, 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`TimedOut\`\"/ ), 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Cancel\`\"/ ), 10 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Skip\`\"/ ), 25 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Init\"/ ), 0 );
    test.identical( _.strCount( op.output, 'Selected 35 run(s):' ), 1 );
    test.identical( _.strCount( op.output, 'Deleted 0 run(s) due to dry run.' ), 1 );
    return null;
  });

  /* */

  a.ready.then( () =>
  {
    test.case = 'save period - 0, save min runs - 0, branch - master, workflow_id - workflow, conclusions - success, delete all';
    core.exportVariable( `INPUT_TOKEN`, token );
    core.exportVariable( `INPUT_REPO`, repo );
    core.exportVariable( `INPUT_DRY`, true );
    core.exportVariable( `INPUT_WORKFLOW_ID`, 'Conditional.yml' );
    core.exportVariable( `INPUT_BRANCH`, 'master' );
    core.exportVariable( `INPUT_SAVE_PERIOD`, 0 );
    core.exportVariable( `INPUT_SAVE_MIN_RUNS_NUMBER`, 0 );
    core.exportVariable( `INPUT_RUN_CONCLUSIONS`, 'success' );
    return null;
  });

  a.shellNonThrowing({ currentPath : actionPath, execPath });
  a.ready.then( ( op ) =>
  {
    test.identical( op.exitCode, 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`TimedOut\`\"/ ), 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Cancel\`\"/ ), 0 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Add workflow \`Skip\`\"/ ), 25 );
    test.identical( _.strCount( op.output, /Deleting workflow run::#\d+ commit message::\"Init\"/ ), 25 );
    test.identical( _.strCount( op.output, 'Selected 50 run(s):' ), 1 );
    test.identical( _.strCount( op.output, 'Deleted 0 run(s) due to dry run.' ), 1 );
    return null;
  });

  /* - */

  return a.ready;
}

run.timeOut = 180000;

// --
// declare
// --

const Proto =
{
  name : 'Action',
  silencing : 1,
  enabled : 1,
  tests : { run },
};

const Self = wTestSuite( Proto );
if( typeof module !== 'undefined' && !module.parent )
wTester.test( Self.name );
