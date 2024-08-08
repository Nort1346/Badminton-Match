export default class Player {
  constructor(color, name) {
    this.name = name;
    this.color = color;
    this.points = 0;
    this.sets = 0;
  }

  addPoints(points) {
    this.points += points;
  }

  addSets(sets) {
    this.sets += sets;
  }

  addOnePoint() {
    this.points += 1;
  }

  removeOnePoint() {
    if (this.points <= 0) return;
    this.points -= 1;
  }

  setName(name) {
    this.name = name;
  }

  getInfo() {
    return `${this.name} (${this.color}): ${this.points} points, ${this.sets} sets`;
  }

  getName() {
    return this.name ?? `Player ${this.color}`;
  }
}
