import React from 'react';
import Head from 'next/head';
import FlowEditor from '../components/flowEditor';

const page = () => (
  <div>
    <Head>
      <title>Flow Chart Prototype</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&amp;subset=latin-ext" rel="stylesheet" />
      <link rel="stylesheet" type="text/css" href="/static/main.css" />
    </Head>
    <FlowEditor />
  </div>
);

export default page;
