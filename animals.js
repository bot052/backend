// @ts-check
export default class Animal {
  constructor() {
    this.animals = ['dog', 'cat', 'chicken'];
  }

  showAnimals() {
    this.animals.map((value) => console.log(value));
  }
}
