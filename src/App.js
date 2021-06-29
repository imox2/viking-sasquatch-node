import React from 'react';
import SortableTree from 'react-sortable-tree';
import { addNodeUnderParent, removeNodeAtPath } from './utils/tree-data-utils';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app

function App() {
  const [treeData, setTreeData] = React.useState([]);
  const [addAsFirstChild, setAddAsFirstChild] = React.useState(false);
  const [firstNames,setFirstNames] = React.useState(false);
  React.useEffect(() => {
     const treeData =  [{ title: 'Peter Olofsson' }, { title: 'Karl Johansson' }];
      setTreeData(treeData);
      const firstNames = [
  'Abraham',
  'Adam',
  'Agnar',
  'Albert',
  'Albin',
  'Albrecht',
  'Alexander',
  'Alfred',
  'Alvar',
  'Ander',
  'Andrea',
  'Arthur',
  'Axel',
  'Bengt',
  'Bernhard',
  'Carl',
  'Daniel',
  'Einar',
  'Elmer',
  'Eric',
  'Erik',
  'Gerhard',
  'Gunnar',
  'Gustaf',
  'Harald',
  'Herbert',
  'Herman',
  'Johan',
  'John',
  'Karl',
  'Leif',
  'Leonard',
  'Martin',
  'Matt',
  'Mikael',
  'Nikla',
  'Norman',
  'Oliver',
  'Olof',
  'Olvir',
  'Otto',
  'Patrik',
  'Peter',
  'Petter',
  'Robert',
  'Rupert',
  'Sigurd',
  'Simon',
];
setFirstNames(firstNames);
  }, []);


  const getNodeKey = ({ treeIndex }) => treeIndex;
    const getRandomName = () =>
      firstNames[Math.floor(Math.random() * firstNames.length)];
    return (
      <div>
        <div style={{ height: 300 }}>
          <SortableTree
            treeData={treeData}
            onChange={treeData => setTreeData(treeData)}
            generateNodeProps={({ node, path }) => ({
              buttons: [
                <button
                  onClick={() =>setTreeData(addNodeUnderParent({
                        treeData: treeData,
                        parentKey: path[path.length - 1],
                        expandParent: true,
                        getNodeKey,
                        newNode: {
                          title: `${getRandomName()} ${
                            node.title.split(' ')[0]
                          }sson`,
                        },
                        addAsFirstChild: addAsFirstChild,
                      }).treeData
                    )
                  }
                >
                  Add Child
                </button>,
                <button
                  onClick={() =>
                    setTreeData(
                      removeNodeAtPath({
                        treeData: treeData,
                        path,
                        getNodeKey,
                      }),
                    )
                  }
                >
                  Remove
                </button>,
              ],
            })}
          />
        </div>

        <button
          onClick={() =>
            setTreeData(
              treeData.concat({
                title: `${getRandomName()} ${getRandomName()}sson`,
              }),
            )
          }
        >
          Add more
        </button>
        <br />
        <label htmlFor="addAsFirstChild">
          Add new nodes at start
          <input
            name="addAsFirstChild"
            type="checkbox"
            checked={addAsFirstChild}
            onChange={() => setAddAsFirstChild(!addAsFirstChild)}
          />
        </label>
      </div>
    );
}

export default App;
