// Dependency-free checks for the example's actual validation and gesture functions.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'examples/pokemon-go.html'),'utf8');
const seed=JSON.parse(html.match(/<script id="seed" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const script=html.match(/<script>\s*('use strict';[\s\S]*?)<\/script>/)[1];
new vm.Script(script);
const validators=script.slice(script.indexOf('function validNode('),script.indexOf('function board()'));
const ctx={};vm.createContext(ctx);vm.runInContext(validators,ctx);
assert(ctx.validWorkspace(seed));
for(const mutate of [s=>s.boards[0].nodes.push(s.boards[0].nodes[0]),s=>s.boards[0].edges[0].to='missing',s=>delete s.boards[0].title,s=>s.boards[0].nodes[0].linkView='missing']){
 const bad=structuredClone(seed);mutate(bad);assert(!ctx.validWorkspace(bad));
}
const moved=structuredClone(seed.boards[0].nodes[0]);let history=0;
Object.assign(ctx,{gesture:{type:'node',id:moved.id,sx:0,sy:0,x:0,y:0,moved:false},camera:{z:.5},node:()=>moved,remember:()=>history++,renderEdges:()=>{},transform:()=>{}});
vm.runInContext(script.slice(script.indexOf('function moveGesture('),script.indexOf('function endGesture(')),ctx);
ctx.moveGesture({clientX:50,clientY:30,currentTarget:{style:{}}});assert.equal(moved.position.x,100);assert.equal(moved.position.y,60);assert.equal(history,1);
ctx.moveGesture({clientX:60,clientY:30,currentTarget:{style:{}}});assert.equal(history,1);
const exampleFiles=['examples/pokemon-go.html','examples/pokemon-go.workspace.json','workflows/pokemon-go.json'];
for(const f of exampleFiles)assert(!/\bWIN\b|CRM|Jasmine|QuickBooks|SharePoint|Zeffy|Entra|winallelsefails|libfile_/i.test(fs.readFileSync(path.join(root,f),'utf8')),f);
const companion=JSON.parse(fs.readFileSync(path.join(root,'examples/pokemon-go.workspace.json'),'utf8'));assert.deepEqual(companion,seed);
console.log('PASS: JavaScript syntax, workspace consistency, invalid imports, zoom-correct model dragging, single history entry, private-content scan.');
