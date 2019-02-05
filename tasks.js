
export async function clean() {
  await shell('shx rm -rf ./output/bin')
  await shell('shx rm -rf ./output/pack')
  await shell('shx rm -rf ./output')
  await shell('shx rm -rf ./node_modules')
}

export async function start() {
  await shell('shx mkdir -p ./output/bin')
  await shell('shx touch ./output/bin/index.js')
  await Promise.all([
    shell(`tsc  --project ./src/tsconfig.json --outDir ./output/bin --watch > /dev/null`),
    shell('fsrun ./output/bin/index.js [node ./output/bin/index.js ./src/* -- node ./output/bin/index.js add remove]')
  ])
}

export async function pack() {
  await shell('shx rm -rf ./output/pack')
  await shell('tsc-bundle ./src/tsconfig.json --outFile ./output/pack/index.js')
  await shell('shx cp ./src/smoke-run ./output/pack')
  await shell('shx cp ./package.json  ./output/pack')
  await shell('shx cp ./readme.md     ./output/pack')
  await shell('shx cp ./license       ./output/pack')
  await shell('cd ./output/pack && npm pack')
  await shell('shx rm ./output/pack/index.js')
  await shell('shx rm ./output/pack/smoke-run')
  await shell('shx rm ./output/pack/package.json')
  await shell('shx rm ./output/pack/readme.md')
  await shell('shx rm ./output/pack/license')
}

export async function install_cli() {
  await pack()
  await shell('cd ./output/pack && npm install ./* -g')
}