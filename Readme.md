
# clean-workflow-runs [![publish](https://github.com/dmvict/clean-workflow-runs/actions/workflows/Publish.yml/badge.svg)](https://github.com/dmvict/clean-workflow-runs/actions/workflows/Publish.yml) [![stable](https://img.shields.io/badge/stability-stable-brightgreen.svg)](https://github.com/emersion/stability-badges#stable)

Flexible and configurable action for removing completed workflow runs.

## Why

Current actions provide less features and its can be unusable in some cases.

## Content

* [Inputs](#inputs)
  - [token](#token)
  - [repo](#repo)
  - [branch](#branch)
  - [run_conclusions](#run_conclusions)
  - [save_period](#save_period)
  - [save_min_runs_number](#save_min_runs_number)
  - [dry](#dry)
* [Workflow examples](#workflow-examples)
  - [Full action syntax](#full-action-syntax)
  - [With default options](#with-default-options)
  - [Clean skipped and cancelled workflows](#clean-skipped-and-cancelled-workflows)
  - [Clean several branches](#clean-several-branches)
  - [Clean several repositories](#clean-several-repositories)
* [About request API using](#about-request-api-using)

## Inputs

### `token`

A personal access token.

Default: environment variable `GITHUB_TOKEN`. See restriction of the environment variable `GITHUB_TOKEN` [in official doc](https://docs.github.com/en/actions/security-guides/automatic-token-authentication).

_Note:_ : to use the environment variable `GITHUB_TOKEN` you need to export it from secrets.

### `repo`

A repository from which delete workflow runs. Default is current repository.

Format of field : `{owner}/{repo_name}`.

Default: current repository.

### `branch`

A branch from which delete workflow runs. Default is all branches.

Default: action deletes runs from all branches.

### `run_conclusions`

Filter for workflow runs conclusion. Accepts all [available conclusions](https://docs.github.com/en/rest/reference/checks#check-runs).

_Note:_ : if filter is not defined, then action filters runs by time. If filter has invalid conclusions its will be ignored. If filter contains only invalid conclusions, then no workflow runs will be deleted.

### `save_period`

Determines period during which the workflow runs will be saved.

The input should be a number that define number of days or string in format `hh:mm:ss`.

Default: 90 days.

### `save_min_runs_number`

A minimal number of completed runs which will be saved.

Default: 10 runs.

_Note:_ : this filter applies to the conclusions selected by options `run_conclusions`. If you need to delete all workflow runs with defined conclusion setup the option to `0`.

### `dry`

Enables dry run of action. Action will print the list of workflow runs to delete.

Default: false.

The option can help to debug the workflow.

## Workflow examples

### Full action syntax

```yaml
- name: Delete workflow runs
  uses: dmvict/clean-workflow-runs@v1.0.0
  with:
    token: ${{ secrets.PRIVATE_GITHUB_TOKEN }}
    repo: user/repo
    branch: master
    run_conclusions: |
      failure
      timed_out
    save_period: 30
    save_min_runs_number: 1
    dry: true
```

It reads: clean all all runs in repository `repo` of user `user`, runs should be older than 30 days, delete runs on branch `master` with status `failure` or `timed_out`. Option `save_min_runs_number` says that at least single run with statuses `failure` or `timed_out`  will be saved.

Option `dry` is `true`, so action deletes no workflow runs and print list of runs which should be deleted.

### With default options

All defaults: delete all runs older than 90 days, save at least 10 runs.
The environment variable `GITHUB_TOKEN` defined globally for the workflow.

```yaml
jobs:
  delete_runs:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    steps:
      - name: Delete workflow runs
        uses: dmvict/clean-workflow-runs@v1.0.0
```

### Clean skipped and cancelled workflows

Filter by conclusion and save no runs older than 6 hours.

```yaml
jobs:
  delete_runs:
    runs-on: ubuntu-latest
    steps:
      - name: Delete workflow runs
        uses: dmvict/clean-workflow-runs@v1.0.0
        with:
          token: ${{ secrets.PRIVATE_GITHUB_TOKEN }}
          run_conclusions: |
            cancelled
            skipped
          save_period: '06:00:00'
          save_min_runs_number: 0
```

### Clean several branches

It is useful if you need to save runs on some branch ( for example, branch for production releases ).

The workflow will delete failed runs older than 10 days in branches `dev` and `staging`.

```yaml
jobs:
  delete_runs:
    strategy :
      matrix :
        branch :
          - dev
          - staging
    runs-on: ubuntu-latest
    steps:
      - name: Delete workflow runs
        uses: dmvict/clean-workflow-runs@v1.0.0
        with:
          token: ${{ secrets.PRIVATE_GITHUB_TOKEN }}
          run_conclusions: |
            failure
          branch: ${{ matrix.branch }}
          save_period: 10
```

### Clean several repositories

If you want to use single workflow to clean several repositories. Default environment token `GITHUB_TOKEN` can have no access to another repositories. It is better to use generated personal access token.

```yaml
jobs:
  delete_runs:
    strategy :
      matrix :
        repository :
          - user/repo-dev
          - user/repo-prod
    runs-on: ubuntu-latest
    steps:
      - name: Delete workflow runs
        uses: dmvict/clean-workflow-runs@v1.0.0
        with:
          token: ${{ secrets.PRIVATE_GITHUB_TOKEN }}
          repo: ${{ matrix.repository }}
          save_period: 120
```

## About request API using

The action makes many API calls - at least 1 per 100 workflow runs + at least 1 per deleted workflow run.

Example: repository has 3000 workflow runs and all should be deleted:

3000/100 + 3000 = 3030;

For example above, at least `3030` API requests will be consumed.

Please, use action taking into account the information above.

[More about GitHub API rates.](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)
