import React from 'react';
import Head from 'next/head';
import faker from 'faker/locale/es';
import Router from 'next/router';
import FlowEditor from '../components/flowEditor';
import Link from 'next/link';

let flowData = {
  text: 'Texto de introducción',
  active: true,
  focused: true,
  first: true,
  child: {
    text: 'Despedida',
    last: true,
  },
};

let generateRandomChild = () => null;

const generateRandomCondition = (child, depth) => {
  const res = {
    text: `¿${faker.lorem.words()}?`,
    condition: true,
    child,
  };

  const values = new Array(5).fill(0).map(() => Math.round(faker.random.number(10)));
  const numOptions = 2 + Math.min(...values);
  const previousWords = [];

  res.options = new Array(numOptions).fill(0).map(() => {
    let word = null;

    while (!word || previousWords.indexOf(word) !== -1) {
      word = faker.lorem.word();
    }
    previousWords.push(word);
    return generateRandomChild(
      {
        text: word,
      },
      depth + 1,
    );
  });

  return res;
};

const generateRandomNode = (child, depth) => {
  const res = {
    text: faker.lorem.words(),
    script: faker.random.number(10) > 8,
    child,
  };

  if (faker.random.number(10) < 10 / (depth / 2)) {
    return generateRandomChild(res, depth + 1);
  }

  return res;
};

generateRandomChild = (node, depth) => {
  const newNode = node;

  if (faker.random.number(10) > 5) {
    newNode.child = generateRandomNode(node.child, depth + 1);
  }

  if (faker.random.number(10) < 10 / depth) {
    newNode.child = generateRandomCondition(node.child, depth + 1);
  }

  return newNode;
};

class Random extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: { ...flowData },
      pageNum: 0,
    };
  }

  componentDidMount() {
    this.calculateRandomData();
  }

  componentDidUpdate() {
    const pageNum = Number.parseInt(Router.query.id, 10) || 0;
    if (pageNum !== this.state.pageNum) {
      this.calculateRandomData();
    }
  }

  calculateRandomData() {
    flowData = {
      text: 'Texto de introducción',
      active: true,
      focused: true,
      first: true,
      child: {
        text: 'Despedida',
        last: true,
      },
    };
    const pageNum = Number.parseInt(Router.query.id, 10) || 0;
    faker.seed(pageNum);
    generateRandomChild(flowData, 1);
    this.setState({ nodes: { ...flowData }, pageNum });
  }

  render() {
    return (
      <div>
        <Head>
          <title>Flow Chart Prototype</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&amp;subset=latin-ext"
            rel="stylesheet"
          />
          <link rel="stylesheet" type="text/css" href="/static/main.css" />
        </Head>
        <FlowEditor flowData={this.state.nodes} />
        <Link
          href={`/random?id=${this.state.pageNum + 1}`}
        >
          <a style={{ position: 'fixed', right: 10 }} className="linkBtn">
            next &gt;
          </a>
        </Link>
        <Link
          href={`/random?id=${this.state.pageNum - 1}`}
        >
          <a style={{ position: 'fixed', left: 10 }} className="linkBtn">
            &lt; prev
          </a>
        </Link>
      </div>
    );
  }
}

export default Random;
