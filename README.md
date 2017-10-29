# Experiment with detecting special names in the text - neural network

## Requirements
* NodeJS
* yarn package manager

## Step 0 - preparing data
* `yarn install`
* download 'The National Corpus of Polish - NKJP' and put all data in `data' directory.

## Step 1 - data parse
 * `yarn run parseAll` - parse data with save all categories and subcategories
 * `yarn run parseWithoutSubtype` - parse data with save only main categories
 * `yarn run parsePersonOrg` - parse data with save only 'person', 'org' and 'other' category
 
 (all parsed data is located in `result` dir)
 
 ## Step 2 - train data
  * `yar run train all`
  * `yar run train person_org`
  * `yar run train without_subtype`
  
  (all trained data is located in `trained` dir)
  
 ## Step - 3 - show result
 
 * `yarn run server'
 *  go to http://localhost:3000/?q=Jan%20ma%20kota