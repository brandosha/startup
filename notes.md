# CS 260 Notes

[My startup - Simon](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260/webprogramming)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My Public IP address is: 34.205.49.20

## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/webprogramming/blob/main/instruction/webServers/https/https.md).

## HTML

Structure: https://codepen.io/brandosha/pen/PwzOEMV
Input: https://codepen.io/brandosha/pen/NPrwyNW
Media: https://codepen.io/brandosha/pen/yyJPvga

## React Part 2: Reactivity

I've been building a different app using React Native and I've been trying to figure out the best way to handle global state, especially when it can be changed by real-time data from the server. React has `useContext` which is what I was initially using along with `useState` for reactive udpates, but as the app grew my Context Manager class was getting pretty big and unwieldy, it needed to be split into smaller, more manageable pieces, but they would still have to share some data amongst themselves (especially the auth context).
I looked into switching to `useReducer` but it seemed like it would require a lot more verbose code and require me to rewrite basically everything. When building this deliverable I drew on that experience and decided to implement custom hooks with a simple `useState` that would effectively allow me to force a re-render, and `useEffect` that would subscribe to changes and could unsubscribe through the cleanup function. This ended up making it much easier to create seperate state managers for auth, posts, and comments that could all share data and also update the app UI in real-time.