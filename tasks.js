export async function clean() {
  await folder('target').delete().exec()
}

export async function build(target = 'target/build') {
  await folder(`target/pack`).delete().exec()
  await shell(`tsc --project src/tsconfig.json --outDir ${target}/index.js`).exec()
  await folder(`${target}`).add('src/smoke-run').exec()
  await folder(`${target}`).add('package.json').exec()
  await folder(`${target}`).add('readme.md').exec()
  await folder(`${target}`).add('license').exec()
  await shell(`cd ${target} && npm pack`).exec()
}

export async function install_cli(target = 'target/build') {
  await build()
  const package = JSON.parse(await file('./package.json').read('utf-8'))
  await shell(`cd ${target} && npm install smoke-run-${package['version']}.tgz -g`).exec()
}