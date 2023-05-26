# Conways-GoL

A simple, static website version of Conway'0s Game of Life.

Originally written along side a Pluralsight video and left to decay over time.

The current code has basically been rewritten, but was first given to ChatGPT to convert from the old ES5 way that the code was originally written, to be in more modern Javascript.
From there, lots a tweeks went in to making the game nice and pretty.

## What is Conway's Game of Life?

### Veratassium Explanation of Conway's Game of Life:
[![Math's Fundamental Flaw](https://img.youtube.com/vi/HeQX2HjkcNo/maxresdefault.jpg)](https://youtu.be/HeQX2HjkcNo)

## Functionality Available

- Resizable Grid where cells can be set to set up a starting point
  - Grid is not bounded, so when the game exits any edge of the grid, it will wrap onto the other side of the screen
- Autoplay functionality, including the ability to toggle on and off. Autoplay includes a Start/Stop
- Speed slider and iteration display
- Ability to clear the grid
- Ability to reset to the last user written state
- Holding the mouse button down can allow you to paint as many checkboxes
- Mobile friendly 

## Advance functionality

- Holding the CTRL key while you drag in the grid will invert the type of cell you create(Dead/Alive). It can be looked at as a type of erase. Similar functionlity exists on mobile by using multiple fingers.
- The cell you click first to start your drag will determine the type of cells the drag will create. If you mouse down on a dead cell and drag, all your drag will turn any cells you enter into alive. If you mouse down on a live cell, any cell you enter will die.
- Game pauses if you begin to draw while the an autoplay has been started. This can allow you to manipulate your simulation in real time, but also prevent the game from interuppting you before you complete your changes.

