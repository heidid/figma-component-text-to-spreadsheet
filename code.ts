const render = () => {
  figma.showUI(__html__, { width: 400, height: 650 });
  // populate form
  const componentList = figma.currentPage
    .findAll(node => node.type === 'COMPONENT')
    .map(node => ({ name: node.name, key: node.key }));
  figma.ui.postMessage({ type: 'componentList', data: componentList });
}

const findText = instanceNode => {
  return instanceNode
    .findAll(node => node.type === 'TEXT')
    .map(textNode => textNode.characters);
}

const formatOutput = (textDataArr, format) => {
  if (format === 'csv') {
    return textDataArr.map((arr) => '"' + arr.join('","') + '"').join("\n");
  } else if (format === 'json') {
    return JSON.stringify(textDataArr, null, ' ');
  }
}

figma.ui.onmessage = msg => {
  const key = msg.data.componentKey;
  const parentNode = msg.data.limitToFrame && figma.currentPage.selection.length > 0 ? figma.currentPage.selection[0] : figma.currentPage;
  const instanceNodes = parentNode.findAll(node => node.type === 'INSTANCE' && node.mainComponent.key === key);
  const textDataArr = instanceNodes.map(findText);
  const result = formatOutput(textDataArr, msg.data.outputFormat);
  render();
  figma.ui.postMessage({ type: 'output', data: result });
};

render();
