const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=process.cwd(),label=process.argv[2];assert(label&&/^[a-z0-9-]+$/.test(label));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const json=file=>JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
const baseline=json('.git/m15/baseline-preservation.json'),resume=json('.git/m15/repair7-resume/baseline.json');
const before=new Set(resume.files.map(item=>item.path)),changes=[];
const within=(file,base)=>{const resolved=path.resolve(file),bounded=path.resolve(base)+path.sep;assert(resolved.startsWith(bounded),'Outside intended workspace: '+file);return resolved;};
const receipt='.git/m15/repair7-resume/restoration-'+label+'.json';assert(!fs.existsSync(receipt),'Receipt exists');
for(const item of baseline.outputs){
 const currentPath=within(item.file,'docs'),bytes=fs.readFileSync(currentPath);
 if(hash(bytes)!==item.sha256){
  const original=fs.readFileSync('.git/m15/original/'+item.file);assert.equal(hash(original),item.sha256,'Original backup mismatch');
  const archive=within('.git/m15/generated/'+label+'/'+item.file,'.git/m15/generated/'+label);assert(!fs.existsSync(archive),'Archive exists');
  fs.mkdirSync(path.dirname(archive),{recursive:true});fs.writeFileSync(archive,bytes);assert.equal(hash(fs.readFileSync(archive)),hash(bytes));
  fs.writeFileSync(currentPath,original);assert.equal(hash(fs.readFileSync(currentPath)),item.sha256);
  changes.push({file:item.file,original:item.sha256,generated:hash(bytes),archive:path.relative(root,archive)});
 }
}
const fresh=cp.execFileSync('git',['ls-files','--others','--exclude-standard','docs'],{encoding:'utf8',maxBuffer:32*1024*1024}).trim().split(/\r?\n/).filter(Boolean);
for(const file of fresh){
 if(before.has(file)||file==='docs/M15_BACCARAT_SHOE_AND_PAIRS.md'||file.startsWith('docs/M15_EVIDENCE/'))continue;
 assert(/^docs\/(M10_.*_EVIDENCE\/|images\/)/.test(file),'Unexpected new output: '+file);
 const source=within(file,'docs'),target=within('docs/M15_EVIDENCE/repair7-resume/generated/'+label+'/'+file,'docs/M15_EVIDENCE/repair7-resume/generated/'+label);
 assert(!fs.existsSync(target),'Target exists');const digest=hash(fs.readFileSync(source));fs.mkdirSync(path.dirname(target),{recursive:true});
 fs.renameSync(source,target);assert.equal(hash(fs.readFileSync(target)),digest);
 changes.push({file,newGenerated:true,sha256:digest,movedTo:path.relative(root,target),deleted:false});
}
for(const item of json('.git/m15/repair7/executable-inputs.json').inputs)assert.equal(hash(fs.readFileSync(item.file)),item.sha256,'Protected executable input changed');
for(const item of baseline.protected)if(item.file!=='vite.config.ts')assert.equal(hash(fs.readFileSync(item.file)),item.sha256,'Protected input changed');
const record={at:new Date().toISOString(),status:'PASS',originalsChecked:baseline.outputs.length,protectedChecked:baseline.protected.length,authorizedException:'vite.config.ts exact Repair7 watcher property; independently frozen270 current executable hashes',changes,deletedFiles:0};
fs.writeFileSync(receipt,JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify({...record,changes:changes.length}));
