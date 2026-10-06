# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m10.spec.ts >> [M10A-E06] real five-card two-split and four-leaf local HUDs preserve exact ownership across widths and200percent text
- Location: tests\browser\m10.spec.ts:343:1

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- main [ref=f8e3]:
  - link "Skip to your hand and actions" [ref=f8e4] [cursor=pointer]:
    - /url: "#player-decisions"
  - region "Blackjack game scene" [ref=f8e5]:
    - generic [ref=f8e6]:
      - heading "Casino Blackjack" [level=1] [ref=f8e8]
      - paragraph [ref=f8e9]: Simulation credits only — no real-money gambling.Credits have no redemption value.
    - generic [ref=f8e10]:
      - region "Blackjack table" [ref=f8e11]:
        - region "Dealer" [ref=f8e12]:
          - 'img "Dealer: Celestine" [ref=f8e13]'
          - heading "Dealer" [level=2] [ref=f8e14]
          - group "Dealer hand" [ref=f8e15]:
            - paragraph [ref=f8e16]: Waiting for the initial deal
          - group "Shoe and deal origin" [ref=f8e17]:
            - paragraph [ref=f8e19]:
              - text: Shoe · Deal origin
              - generic [ref=f8e20]: 6 decks
          - paragraph [ref=f8e21]:
            - text: BLACKJACK PAYS 3:2
            - generic [ref=f8e22]: DEALER STANDS ON ALL 17
        - generic [ref=f8e23]:
          - region "Seat 1" [ref=f8e24]:
            - generic [ref=f8e25]:
              - generic [ref=f8e26]:
                - 'img "Computer guest: Caelan, Male Elf" [ref=f8e27]'
                - generic [ref=f8e28]:
                  - heading "Caelan" [level=2] [ref=f8e29]
                  - paragraph [ref=f8e30]: Male Elf
                  - paragraph [ref=f8e31]: Seat 1 · Computer
              - generic [ref=f8e32]:
                - paragraph [ref=f8e33]: "MAIN: 25 credits"
                - paragraph [ref=f8e34]: Waiting for the deal
          - region "Seat 3" [ref=f8e35]:
            - generic [ref=f8e36]:
              - generic [ref=f8e37]:
                - 'img "Computer guest: Elaria, Female Elf" [ref=f8e38]'
                - generic [ref=f8e39]:
                  - heading "Elaria" [level=2] [ref=f8e40]
                  - paragraph [ref=f8e41]: Female Elf
                  - paragraph [ref=f8e42]: Seat 3 · Computer
              - generic [ref=f8e43]:
                - paragraph [ref=f8e44]: "MAIN: 25 credits"
                - paragraph [ref=f8e45]: Waiting for the deal
          - region "Seat 4" [ref=f8e46]:
            - group "Your player HUD" [ref=f8e47]:
              - generic [ref=f8e48]:
                - generic [ref=f8e49]:
                  - 'img "Your avatar: Roland, Male Human Knight" [ref=f8e50]'
                  - generic [ref=f8e51]:
                    - paragraph [ref=f8e52]: YOU
                    - heading "Roland" [level=2] [ref=f8e53]
                    - paragraph [ref=f8e54]: Male Human Knight
                    - paragraph [ref=f8e55]: Seat 4 · You · Human
                - paragraph [ref=f8e56]: "MAIN: 0 credits"
              - generic [ref=f8e58]:
                - generic [aria-hidden] [ref=f8e59]:
                  - generic [ref=f8e60]: ♠
                  - generic [ref=f8e61]: ♠
                - paragraph [ref=f8e62]: Your cards will be dealt here.
          - region "Seat 6" [ref=f8e63]:
            - generic [ref=f8e64]:
              - generic [ref=f8e65]:
                - 'img "Computer guest: Seraphine, Female Human Knight" [ref=f8e66]'
                - generic [ref=f8e67]:
                  - heading "Seraphine" [level=2] [ref=f8e68]
                  - paragraph [ref=f8e69]: Female Human Knight
                  - paragraph [ref=f8e70]: Seat 6 · Computer
              - generic [ref=f8e71]:
                - paragraph [ref=f8e72]: "MAIN: 25 credits"
                - paragraph [ref=f8e73]: Waiting for the deal
      - region "Your gameplay controls" [ref=f8e74]:
        - status [ref=f8e76]: Betting open
        - region "Your credits" [ref=f8e77]:
          - heading "Credits" [level=2] [ref=f8e78]
          - generic [ref=f8e79]:
            - generic [ref=f8e80]:
              - term [ref=f8e81]: Available
              - definition [ref=f8e82]: "600"
            - generic [ref=f8e83]:
              - term [ref=f8e84]: Reserved / current exposure
              - definition [ref=f8e85]: "0"
            - generic [ref=f8e86]:
              - term [ref=f8e87]: Pending return
              - definition [ref=f8e88]: "0"
        - region "Your wager" [ref=f8e89]:
          - heading "Take your seat" [level=2] [ref=f8e90]
          - generic [ref=f8e91]:
            - generic [ref=f8e92]:
              - text: Your main wager
              - generic [ref=f8e93]: (credits)
            - spinbutton "Your main wager (credits)" [active] [ref=f8e94]: "100"
            - generic [ref=f8e95]:
              - button "Choose 10 credits" [ref=f8e96] [cursor=pointer]: "10"
              - button "Choose 25 credits" [ref=f8e97] [cursor=pointer]: "25"
              - button "Choose 100 credits" [pressed] [ref=f8e98] [cursor=pointer]: "100"
            - button "Deal" [ref=f8e99] [cursor=pointer]
          - paragraph [ref=f8e100]: 10–1000 whole credits. Your guests are already ready to play.
          - group [ref=f8e101]:
            - generic "Optional wagers" [ref=f8e102] [cursor=pointer]
            - option "Seat 1" [selected]
            - option "Seat 3"
            - option "Seat 6"
    - paragraph [ref=f8e103]: Existing 6-deck shoe continues · Computer guests play with their own simulation credits.
  - complementary "Table preferences and demo tools" [ref=f8e104]:
    - generic [ref=f8e105]:
      - paragraph [ref=f8e106]: 4 players · 1 human · 3 computer guests
      - button "New table · reset to 1000 credits" [disabled] [ref=f8e107]
    - generic [ref=f8e108]:
      - generic [ref=f8e109]:
        - checkbox "Reduce motion" [checked] [disabled] [ref=f8e110]
        - text: Reduce motion
      - paragraph [ref=f8e111]: Reduced motion is enabled by your device.
    - group [ref=f8e112]:
      - generic "Change Character · Roland" [ref=f8e113] [cursor=pointer]
      - option "Caelan · Male Elf"
      - option "Elaria · Female Elf"
      - option "Roland · Male Human Knight" [selected]
      - option "Seraphine · Female Human Knight"
      - option "Alaric · Male Mage"
      - option "Nyra · Female Mage"
      - option "Lucien · Male Noble"
      - option "Celestine · Female Noble · Dealer (reserved for this table)" [disabled]
      - option "Garruk · Male Half-Orc Warrior"
      - option "Vesha · Female Half-Orc Warrior"
      - option "Borin · Male Dwarf"
      - option "Brynja · Female Dwarf"
    - group [ref=f8e114]:
      - generic "Developer / demo tools" [ref=f8e115] [cursor=pointer]
      - option "Classic Blackjack (v1.2 · Re-split Aces)" [selected]
      - option "Five-Card Charlie Demo (v1.2 · Re-split Aces)"
      - option "Classic Blackjack"
      - option "Five-Card Charlie Demo"
```