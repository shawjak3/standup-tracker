class Condition {
  isNew: boolean;

  constructor(isNew: boolean) {
    this.isNew = isNew;
  }

  checkCondition() {
    if (this.isNew) {
      console.log('Have so much fun riding today!')
    } else {
      console.log('Time for an oil change')
    }
  }
}

class Dirtbike extends Condition {
  size: number;
  brand: string;
  type: string;

  constructor(size: number, brand: string, type: string, isNew: boolean) {
    super(isNew)
    this.size = size;
    this.brand = brand;
    this.type = type;
  }

  makeNoise() {
    if (this.type === '2stroke') {
      console.log('braaaaaap')
    } else {
      console.log('baaaaaaap')
    }
  }
}

const beta: Dirtbike = new Dirtbike(300, 'Beta', '2stroke', true)
beta.makeNoise()
beta.checkCondition()

enum Brand {
  KTM,
  BETA,
  HONDA,
  HUSKY
}

enum Color {
  KTM = 'orange',
  BETA = 'white',
  HONDA = 'red',
  HUSKY = 'yellow'
}

interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

const numberPair: KeyValuePair<string, number> = {
  key: 'age',
  value: 30
}

const stringPair: KeyValuePair<number, string> = {
  key: 1,
  value: 'one'
}

type Result = string | number; 
