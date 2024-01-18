# Github Actions

![Trees](../img/cover/chromecast-trees-1.jpg)


## Examples
- [Running org:viz](#orgviz)
- [PMD work to bail out when  violations count is not zero](#pmd)

-----


<a name="orgviz"></a>
### Running org:viz using Github Actions

```yml
name: onDemand-org-viz 
run-name: run org viz
on: [workflow_dispatch]
  
jobs:
  run-org-viz:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: sfdx-actions/setup-sfdx@v1

      - run: echo ${{ github.actor }} is running this...
      - run: echo ${{ secrets.SEL_AUTH_JSON_BASE64 }} > ./mySecret.json.txt
      - run: cat ./mySecret.json.txt | base64 -d > ./mySecret.json
      - run: echo "SECRET_JSON=$(jq -c . < ./mySecret.json)" >> $GITHUB_ENV 
      - run: echo '${{ fromJson(env.SECRET_JSON).result.id }}'
      
      - run: echo FN=slide__$RANDOM >> $GITHUB_ENV     

      - name: Install mohanc sfdx plugins
        run: |
          echo 'y' | sfdx plugins:install sfdx-mohanc-plugins
          sfdx plugins

      - name: Process secrets
        run: | 
         echo ${{ fromJson(env.SECRET_JSON).result.sfdxAuthUrl }} > ./mySecret.url.txt
         sfdx auth:sfdxurl:store -f ./mySecret.url.txt -s -a targetOrg

      - name: Run Org Viz
        run: sfdx mohanc:org:viz   -u ${{ fromJson(env.SECRET_JSON).result.username }}

      - name: setup git config
        run: |
          # setup the username and email. using 'GitHub Actions Bot' with no email by default
          git config user.name "GitHub Actions Bot"
          git config user.email "<>"

      - name: Commit files
        run: |
          git pull origin HEAD
          git add Org.json Org.svg
          git commit -m "add org viz files"
          git push origin HEAD

```

<a name='pmd'></a>
## PMD workflow bailing out when violations count is not zero


```yml
PMD workflow bailing out when violations count is not zero
 - uses: pmd/pmd-github-action@v1
        id: pmd
        with:
          version: '6.40.0'
          sourcePath: 'mc2Project/force-app/main/default/classes'
          rulesets: 'pmd/rulesets/apex_ruleset.xml'
      
      - name: Fail build if there are violations
        if: steps.pmd.outputs.violations != 0
        run: exit 1
```

- Detailed
```yml
name: on-push-deployment-develop
run-name: Push Check Deploy - develop 

on: [workflow_dispatch]
jobs:
  check-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install sfdx-cli -g

      - run: echo "${{ secrets.SALESFORCE_JWT_SECRET_KEY }}" > server.key
      - run: sfdx force:auth:jwt:grant --clientid=${{ secrets.SALESFORCE_CONSUMER_KEY }} --jwtkeyfile=server.key --username=${{ secrets.SALESFORCE_DEVHUB_USERNAME }} --setdefaultdevhubusername
      - name: Install mohanc sfdx plugin
        run: |
          echo 'y' | sfdx plugins:install sfdx-mohanc-plugins
          sfdx plugins

      - name: Run Org Viz
        run: sfdx mohanc:org:viz   -u ${{ secrets.SALESFORCE_DEVHUB_USERNAME }}

      - uses: actions/setup-java@v3
        with:
          distribution: 'zulu' # See 'Supported distributions' for available options
          java-version: '17'
      - run: |
          cd src 
          java HelloWorld.java 
          cd ..

      - uses: pmd/pmd-github-action@v1
        id: pmd
        with:
          version: '6.40.0'
          sourcePath: 'mc2Project/force-app/main/default/classes'
          rulesets: 'pmd/rulesets/apex_ruleset.xml'
      
      - name: Fail build if there are violations
        if: steps.pmd.outputs.violations != 0
        run: exit 1
      
      - name: Upload SARIF file
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: pmd-report.sarif

      - name: Source DeployCheck Deploy
        run: |
          cd mc2Project 
          sfdx force:source:deploy -u ${{ secrets.SALESFORCE_DEVHUB_USERNAME }} -p force-app -c --verbose 
          sfdx mohanc:tooling:query -q ../.soql/deploymentStatus.soql -u ${{ secrets.SALESFORCE_DEVHUB_USERNAME }} -f json > ./deploymentStatus.json
          cat ./deploymentStatus.json

      - name: setup git config
        run: |
          # setup the username and email. using 'GitHub Actions Bot' with no email by default
          git config user.name "GitHub Actions Bot"
          git config user.email "<>"

      - name: Commit files
        run: |
          git add Org.json Org.svg 
          git commit -m "updated Org Viz files"
          git push origin HEAD


```