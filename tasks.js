
export async function clean() {
  await folder('./target/bin').delete().exec().catch(() => { })
  await folder('./target/pack').delete().exec().catch(() => { })
  await folder('./target').delete().exec().catch(() => { })
  await folder('./node_modules').delete().exec().catch(() => { })
}

export async function start() {
  await file('./target/bin/index.js').create().exec()
  await Promise.all([
    shell(`tsc --project ./src/tsconfig.json --outDir ./target/bin --watch > /dev/null`).exec(),
    shell('fsrun ./target/bin/index.js [node ./target/bin/index.js ./src/* -x node ./target/bin/index.js add remove]').exec()
  ])
}

export async function pack() {
  // build
  await folder('./target/pack').delete().exec()
  await shell('tsc-bundle ./src/tsconfig.json --outFile ./target/pack/index.js').exec()
  await folder('./target/pack').add('./src/smoke-run').exec()
  await folder('./target/pack').add('./package.json').exec()
  await folder('./target/pack').add('./readme.md').exec()
  await folder('./target/pack').add('./license').exec()
  // pack
  await shell('cd ./target/pack && npm pack').exec()
}

export async function install_cli() {
  await pack()
  const package = JSON.parse(await file('./package.json').read('utf-8'))
  await shell(`cd ./target/pack && npm install smoke-run-${package['version']}.tgz -g`).exec()
}