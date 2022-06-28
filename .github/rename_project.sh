
#!/usr/bin/env bash
while getopts a:n:u:d: flag
do
    case "${flag}" in
        a) author=${OPTARG};;
        n) name=${OPTARG};;
        u) urlname=${OPTARG};;
        d) description=${OPTARG};;
    esac
done

echo "Author: $author";
echo "Project Name: $name";
echo "Project URL name: $urlname";
echo "Description: $description";

#remove ui-plugin

pageName=$(sed -r 's/(ui-plugin-)(.*)/\2/g' <<< "$urlname")
cameCase=$(sed -r 's/(^|-)(\w)/\U\2/g' <<<"$pageName")
namespace="namespace $cameCase"
plugin="new $cameCase.Plugin()"
settings="IPlugin$cameCase"
pageid=$(sed 's/[a-z ]//g' <<< "$cameCase")

echo "$cameCase $namespace $settings $pageid"


echo "Renaming project..."

original_author="MatrixRequirements"
original_name="matrix-ui-plugin-boilerplate"
original_description=" matrix-ui-plugin-boilerplate created by someone"
original_setting="IPluginBoilerPlate"
original_namespace="namespace BoilerPlate"
original_plugin="new BoilerPlate.Plugin()"
original_pageid="BPP"

for filename in $(git ls-files) 
do
    echo "Processing $filename"
   [[ $filename = .github* ]] &&  echo "Skipping $filename"
   [[ $filename != .github* ]] &&  sed -i "s/$original_name/$name/g" "$filename"
   [[ $filename != .github* ]] &&  sed -i "s/$original_author/$author/g" "$filename"
   [[ $filename != .github* ]] &&  sed -i "s/$original_description/$description/g" "$filename"
   [[ $filename != .github* ]] &&  sed -i "s/$original_setting/$settings/g" "$filename"
   [[ $filename != .github* ]] &&  sed -i "s/$original_namespace/$namespace/g" "$filename"
   [[ $filename != .github* ]] &&  sed -i "s/$original_pageid/$pageid/g" "$filename"
   [[ $filename != .github* ]] &&  sed -i "s/$original_plugin/$plugin/g" "$filename"
   [[ $filename != .github* ]] &&  echo "$filename fixed"
 done

cd src

echo "renaming source"

for filename in $(git ls-files) 
do    
    [[ $filename = _* ]] && echo  "$filename -->  $pageid$filename"
    [[ $filename = _* ]] &&  git mv $filename $pageid$filename 
done


git config --local user.email action@github.com
git config --local user.name GitHub Action
cd ..
git rm .github/rename_project.sh
git rm .github/workflows/template.yaml

git commit -m "Rename template to project $cameCase" -a




# This command runs only once on GHA!
