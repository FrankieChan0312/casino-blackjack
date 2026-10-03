# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pa1.spec.ts >> [PA1-E04] character keyboard focus touch targets reduced motion and unclipped identities preserve cards at desktop tablet and mobile widths
- Location: tests\browser\pa1.spec.ts:88:1

# Error details

```
Error: UNKNOWN: unknown error, open 'C:\Users\user\Documents\GitHub\casino-blackjack\docs\images\pa1-responsive-768.png'
```

# Page snapshot

```yaml
- main [ref=f1e3]:
  - link "Skip to your hand and actions" [ref=f1e4] [cursor=pointer]:
    - /url: "#player-decisions"
  - generic [ref=f1e5]:
    - generic [ref=f1e6]:
      - paragraph [ref=f1e7]: An evening at the table
      - heading "Casino Blackjack" [level=1] [ref=f1e8]
    - paragraph [ref=f1e9]: Simulation credits only — no real-money gambling.Credits have no redemption value.
  - status [ref=f1e10]: Your turn
  - region "Blackjack table" [ref=f1e11]:
    - region "Dealer" [ref=f1e12]:
      - heading "Dealer" [level=2] [ref=f1e13]
      - img "Original illustrated female dealer in professional attire" [ref=f1e14]
      - generic [ref=f1e45]:
        - img "4 of clubs" [ref=f1e47]:
          - generic [ref=f1e48]:
            - text: "4"
            - generic [aria-hidden] [ref=f1e49]: ♣
          - generic [aria-hidden] [ref=f1e50]: ♣
          - generic [aria-hidden] [ref=f1e51]: "4"
        - img "Hidden dealer card" [ref=f1e52]: ◆
        - paragraph [ref=f1e53]: "Visible total: 4"
        - paragraph [ref=f1e54]: Hole card hidden
    - paragraph [ref=f1e55]:
      - text: BLACKJACK PAYS 3:2
      - generic [ref=f1e56]: DEALER STANDS ON ALL 17
    - generic [ref=f1e57]:
      - region "Seat 1" [ref=f1e58]:
        - generic [ref=f1e59]:
          - 'img "Computer guest: Caelan, Male Elf" [ref=f1e60]'
          - generic [ref=f1e61]:
            - heading "Caelan" [level=2] [ref=f1e62]
            - paragraph [ref=f1e63]: Male Elf
            - paragraph [ref=f1e64]:
              - text: Seat 1 · Computer
              - generic [ref=f1e65]: "MAIN: 25 credits"
        - article "Hand A" [ref=f1e66]:
          - generic [ref=f1e67]:
            - img "J of hearts" [ref=f1e68]:
              - generic [ref=f1e69]:
                - text: J
                - generic [aria-hidden] [ref=f1e70]: ♥
              - generic [aria-hidden] [ref=f1e71]: ♥
              - generic [aria-hidden] [ref=f1e72]: J
            - img "5 of diamonds" [ref=f1e73]:
              - generic [ref=f1e74]:
                - text: "5"
                - generic [aria-hidden] [ref=f1e75]: ♦
              - generic [aria-hidden] [ref=f1e76]: ♦
              - generic [aria-hidden] [ref=f1e77]: "5"
            - img "2 of clubs" [ref=f1e78]:
              - generic [ref=f1e79]:
                - text: "2"
                - generic [aria-hidden] [ref=f1e80]: ♣
              - generic [aria-hidden] [ref=f1e81]: ♣
              - generic [aria-hidden] [ref=f1e82]: "2"
          - paragraph [ref=f1e83]: "Total: 17 · Wager: 25"
          - paragraph [ref=f1e84]: Decisions complete
      - region "Seat 3" [ref=f1e85]:
        - generic [ref=f1e86]:
          - 'img "Computer guest: Elaria, Female Elf" [ref=f1e87]'
          - generic [ref=f1e88]:
            - heading "Elaria" [level=2] [ref=f1e89]
            - paragraph [ref=f1e90]: Female Elf
            - paragraph [ref=f1e91]:
              - text: Seat 3 · Computer
              - generic [ref=f1e92]: "MAIN: 25 credits"
        - article "Hand A" [ref=f1e93]:
          - generic [ref=f1e94]:
            - img "A of hearts" [ref=f1e95]:
              - generic [ref=f1e96]:
                - text: A
                - generic [aria-hidden] [ref=f1e97]: ♥
              - generic [aria-hidden] [ref=f1e98]: ♥
              - generic [aria-hidden] [ref=f1e99]: A
            - img "8 of spades" [ref=f1e100]:
              - generic [ref=f1e101]:
                - text: "8"
                - generic [aria-hidden] [ref=f1e102]: ♠
              - generic [aria-hidden] [ref=f1e103]: ♠
              - generic [aria-hidden] [ref=f1e104]: "8"
          - paragraph [ref=f1e105]: "Total: 19 · Wager: 25"
          - paragraph [ref=f1e106]: Decisions complete
      - region "Seat 4" [ref=f1e107]:
        - generic [ref=f1e108]:
          - 'img "Your avatar: Vesha, Female Half-Orc Warrior" [ref=f1e109]'
          - generic [ref=f1e110]:
            - heading "Vesha" [level=2] [ref=f1e111]: ▸ Vesha
            - paragraph [ref=f1e112]: Female Half-Orc Warrior
            - paragraph [ref=f1e113]:
              - text: Seat 4 · You · Human
              - generic [ref=f1e114]: "MAIN: 100 credits"
        - article "Hand A" [ref=f1e115]:
          - generic [ref=f1e116]:
            - heading "Hand A · Current hand" [level=3] [ref=f1e117]
            - generic [ref=f1e118]: ACTIVE
          - generic [ref=f1e119]:
            - img "5 of hearts" [ref=f1e120]:
              - generic [ref=f1e121]:
                - text: "5"
                - generic [aria-hidden] [ref=f1e122]: ♥
              - generic [aria-hidden] [ref=f1e123]: ♥
              - generic [aria-hidden] [ref=f1e124]: "5"
            - img "4 of spades" [ref=f1e125]:
              - generic [ref=f1e126]:
                - text: "4"
                - generic [aria-hidden] [ref=f1e127]: ♠
              - generic [aria-hidden] [ref=f1e128]: ♠
              - generic [aria-hidden] [ref=f1e129]: "4"
          - paragraph [ref=f1e130]: "Total: 9 · Wager: 100"
          - paragraph [ref=f1e131]: Playing
      - region "Seat 6" [ref=f1e132]:
        - generic [ref=f1e133]:
          - 'img "Computer guest: Seraphine, Female Human Knight" [ref=f1e134]'
          - generic [ref=f1e135]:
            - heading "Seraphine" [level=2] [ref=f1e136]
            - paragraph [ref=f1e137]: Female Human Knight
            - paragraph [ref=f1e138]:
              - text: Seat 6 · Computer
              - generic [ref=f1e139]: "MAIN: 25 credits"
        - article "Hand A" [ref=f1e140]:
          - generic [ref=f1e141]:
            - img "9 of hearts" [ref=f1e142]:
              - generic [ref=f1e143]:
                - text: "9"
                - generic [aria-hidden] [ref=f1e144]: ♥
              - generic [aria-hidden] [ref=f1e145]: ♥
              - generic [aria-hidden] [ref=f1e146]: "9"
            - img "6 of diamonds" [ref=f1e147]:
              - generic [ref=f1e148]:
                - text: "6"
                - generic [aria-hidden] [ref=f1e149]: ♦
              - generic [aria-hidden] [ref=f1e150]: ♦
              - generic [aria-hidden] [ref=f1e151]: "6"
          - paragraph [ref=f1e152]: "Total: 15 · Wager: 25"
          - paragraph [ref=f1e153]: Playing
  - generic [ref=f1e154]:
    - region "Primary actions" [ref=f1e155]:
      - generic [ref=f1e156]:
        - button "Hit" [ref=f1e157] [cursor=pointer]
        - button "Stand" [ref=f1e158] [cursor=pointer]
        - button "Double" [ref=f1e159] [cursor=pointer]
        - button "Split" [disabled] [ref=f1e160]
        - button "Surrender" [ref=f1e161] [cursor=pointer]
      - group [ref=f1e162]:
        - generic "Action guidance · Unavailable actions explained" [ref=f1e163] [cursor=pointer]
    - region "Your credits" [ref=f1e164]:
      - heading "Your simulation credits" [level=2] [ref=f1e165]
      - generic [ref=f1e166]:
        - generic [ref=f1e167]:
          - term [ref=f1e168]: Available
          - definition [ref=f1e169]: "900"
        - generic [ref=f1e170]:
          - term [ref=f1e171]: Reserved / current exposure
          - definition [ref=f1e172]: "100"
        - generic [ref=f1e173]:
          - term [ref=f1e174]: Pending return
          - definition [ref=f1e175]: "0"
  - paragraph [ref=f1e176]: Existing 6-deck shoe continues · Computer guests play with their own simulation credits.
  - group [ref=f1e177]:
    - generic "Change Character · Vesha" [ref=f1e178] [cursor=pointer]
    - 'img "Your character: Vesha, Female Half-Orc Warrior" [ref=f1e179]'
    - generic [ref=f1e180]: Your character
    - combobox "Your character" [active] [ref=f1e181]:
      - option "Caelan · Male Elf"
      - option "Elaria · Female Elf"
      - option "Roland · Male Human Knight"
      - option "Seraphine · Female Human Knight"
      - option "Alaric · Male Mage"
      - option "Nyra · Female Mage"
      - option "Lucien · Male Noble"
      - option "Celestine · Female Noble"
      - option "Garruk · Male Half-Orc Warrior"
      - option "Vesha · Female Half-Orc Warrior" [selected]
      - option "Borin · Male Dwarf"
      - option "Brynja · Female Dwarf"
    - paragraph [ref=f1e182]: Choose at any time. If a guest has this character, they take your previous character.
  - group [ref=f1e183]:
    - generic "Developer / demo tools" [ref=f1e184] [cursor=pointer]
    - option "Classic Blackjack" [selected]
```

# Test source

```ts
  1 | const fs=require('node:fs'),path=require('node:path');const makeNative=require('./native-client.cjs');const write=fs.promises.writeFile.bind(fs.promises);let native,counter=0;const active=new Map();
> 2 | fs.promises.writeFile=async function(target,data,options){const source=path.resolve(String(target));if(!/[/\\]docs[/\\]images[/\\]pa1-[^/\\]+\.png$/.test(source))return write(target,data,options);native ||= makeNative();const directory=process.env.M10_IO_DIR;fs.mkdirSync(directory,{recursive:true});const mode=process.env.M10_IO_MODE||'canonical';const actual=mode==='unique'?path.join(directory,process.pid+'-'+(++counter)+'-'+path.basename(source)):source;const before=await native.inspect(actual);const sameProcessWriters=(active.get(actual)||0)+1;active.set(actual,sameProcessWriters);const writeStart=new Date().toISOString();let result,error;try{result=await write(actual,data,options);}catch(e){error=e;}const writeEnd=new Date().toISOString();active.set(actual,active.get(actual)-1);let after;try{after=await native.inspect(actual,!!error);}catch(e){after={diagnosticError:e.message};}const row={pid:process.pid,ppid:process.ppid,mode,canonical:source,actual,flags:typeof options==='object'&&options?.flag||'w',writeStart,writeEnd,sameProcessWriters,bufferBytes:data.length,status:error?'FAIL':'PASS',error:error?Object.fromEntries(Object.getOwnPropertyNames(error).map(k=>[k,error[k]])):undefined,before,after};fs.appendFileSync(path.join(directory,'io-'+process.pid+'.jsonl'),JSON.stringify(row)+'\n');if(error)throw error;if(after.diagnosticError)throw Error(after.diagnosticError);return result;};
    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ^ Error: UNKNOWN: unknown error, open 'C:\Users\user\Documents\GitHub\casino-blackjack\docs\images\pa1-responsive-768.png'
  3 | 
```