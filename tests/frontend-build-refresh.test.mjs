import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const start=app.indexOf('async function reloadIfFrontendBuildIsStale()');
const end=app.indexOf('\nfunction bindNavigation()',start);
const current=app.match(/const TEAM_LINK_FRONTEND_BUILD = "([^"]+)"/)[1];
function setup(latest,href='https://salon.example/?view=lounge',ok=true){
 const redirects=[];
 const location={href,replace(url){redirects.push(url);this.href=url;}};
 const context=vm.createContext({TEAM_LINK_FRONTEND_BUILD:current,URL,Date,window:{location},console:{warn(){}},fetch:async()=>({ok,text:async()=>`<script src="app.js?v=${latest}"></script>`})});
 vm.runInContext(app.slice(start,end),context);
 return{check:()=>context.reloadIfFrontendBuildIsStale(),redirects,location};
}
test('published HTML, stylesheet and running script use the same build',()=>{
 assert.equal(html.match(/app\.js\?v=([^"']+)/)[1],current);
 assert.equal(html.match(/styles\.css\?v=([^"']+)/)[1],current);
});
test('current build does not refresh',async()=>{
 const s=setup(current);assert.equal(await s.check(),false);assert.equal(s.redirects.length,0);
});
test('a stale cached script refreshes once, never loops on the same target build',async()=>{
 const s=setup('new-release');assert.equal(await s.check(),true);
 assert.equal(new URL(s.location.href).searchParams.get('view'),'lounge');
 assert.equal(await s.check(),false);assert.equal(s.redirects.length,1);
});
test('a later different build can still refresh after a previous update',async()=>{
 const s=setup('new-release','https://salon.example/?view=lounge&frontendBuild=previous-release');
 assert.equal(await s.check(),true);assert.equal(s.redirects.length,1);
});
test('unsuccessful version lookup does not refresh',async()=>{
 const s=setup('new-release',undefined,false);assert.equal(await s.check(),false);assert.equal(s.redirects.length,0);
});
