#!/bin/bash

branch="$(git rev-parse --abbrev-ref HEAD)"
envs=( "prod" ) # "stage" "prod"
countries=(" sk" "ro" "pl" "it" "ssb" "ed" "ap" ) # "cz" "sk" "ro" "pl" "it" "ssb" "ed" "ap"
products=( "content" ) # "all" "checkout" "catalog" "customer" "content" "platform"
grep_tags=( "all" )
specs="-"
cloud_nsf_url="-"
cloud_mag_url="-"
send_to_dashboard="true"
release_testing="false"

run_pipeline() {
    branch="$1"
    env="$2"
    country="$3"
    product="$4"
    grep_tags="$5"
    specs="$6"
    cloud_nsf_url="$7"
    cloud_mag_url="$8"
    send_to_dashboard="$9"
    release_testing="${10}"
    curl -L -X POST 'https://dev.azure.com/drmaxglobal/qaa-team/_apis/pipelines/210/runs?api-version=6.0-preview.1' \
     -H 'Authorization: Basic OjRmamptNnhuMmh6dDZzend3NW9rbHZqdjZsanhqMjRuNGV5cWFsNHhpN2RhZm1hN2x4dHE=' \
     -H 'Content-Type: application/json'  \
     --data-raw "{ \"resources\": { \"repositories\": {\"self\": {\"refName\": \"refs/heads/$branch\"}}},\"templateParameters\": {\"ENVIRONMENT\": \"$env\",\"SCOPE\": \"$country\",\"PRODUCT\": \"$product\",\"GREP_TAGS\": \"$grep_tags\",\"SPECS\": \"$specs\",\"CLOUD_NSF_URL\": \"$cloud_nsf_url\",\"CLOUD_MAG_URL\": \"$cloud_mag_url\",\"SEND_TO_DASHBOARD\": \"$send_to_dashboard\",\"RELEASE_TESTING\": \"$release_testing\"}}"
}

for env in "${envs[@]}"
do
    for country in "${countries[@]}"
    do
        for product in "${products[@]}"
        do
            for grep_tag in "${grep_tags[@]}"
            do
                echo $branch $env $country $product $grep_tag $specs $cloud_nsf_url $cloud_mag_url $send_to_dashboard $release_testing
                run_pipeline $branch $env $country $product $grep_tag $specs $cloud_nsf_url $cloud_mag_url $send_to_dashboard $release_testing
                echo "========================================================================================"
            done
        done
    done
done

: <<'END'
run_pipeline $branch "stage" "sk" all all - $cloud_nsf_url $cloud_mag_url $send_to_dashboard $release_testing
run_pipeline $branch "stage" "sk" catalog all - $cloud_nsf_url $cloud_mag_url $send_to_dashboard $release_testing
run_pipeline $branch "stage" "sk" clean_up all - $cloud_nsf_url $cloud_mag_url $send_to_dashboard $release_testing
run_pipeline $branch "stage" "sk" all dev_cloud - $cloud_nsf_url $cloud_mag_url $send_to_dashboard $release_testing
run_pipeline $branch "stage" "sk" all prod_friendly - $cloud_nsf_url $cloud_mag_url $send_to_dashboard $release_testing
run_pipeline $branch "stage" "sk" all e2e - $cloud_nsf_url $cloud_mag_url $send_to_dashboard $release_testing
run_pipeline $branch "stage" "sk" all priority_1 - $cloud_nsf_url $cloud_mag_url $send_to_dashboard $release_testing
run_pipeline $branch "stage" "sk" checkout priority_1 - $cloud_nsf_url $cloud_mag_url $send_to_dashboard $release_testing
run_pipeline $branch "stage" "sk" all all specs/content/legal.ts $cloud_nsf_url $cloud_mag_url $send_to_dashboard $release_testing
END
