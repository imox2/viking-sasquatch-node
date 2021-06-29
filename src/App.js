import React from 'react';
import SortableTree from 'react-sortable-tree';
import { addNodeUnderParent, removeNodeAtPath } from './utils/tree-data-utils';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app

function App() {
  const [treeData, setTreeData] = React.useState([]);
  const [addAsFirstChild, setAddAsFirstChild] = React.useState(false);
  const [firstNames,setFirstNames] = React.useState(false);
  React.useEffect(() => {
     const fetchData = async () => {
      // const data = await axios.get("localhost:3000/all");
      let response = await fetch("http://localhost:3000/all", {

    method: "GET",
  });

      const data = await response.json();

    //   fetch("http://localhost:3000/all")
    // .then(response => response.json())
    // .then(jsondata => console.log(jsondata))
      console.log("response:",response);
      // const data = JSON.parse(response.json);
      console.log("data:",data);

      setTreeData(data);
    }
    fetchData();
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

  const changeTreeData = treeData => {
    console.log("changeTreeData")
    setTreeData(treeData);
    setData();
  }

  const addMoreData = () => {
    console.log("addMoreData");
    const data = treeData.concat({
      title: `${getRandomName()} ${getRandomName()}sson`,
    })
            setTreeData(data);
            setData(data);
  }

   const setData = async (treeData) => {
    let response = await fetch("http://localhost:3000/change", {
      method: "POST",
      body: JSON.stringify( {data: treeData}),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    return response;
  };

  // const setData = async () => {
  //     console.log("setData")
  //     const response = await axios.post("localhost:3000/change", {data: treeData});
  //     if(response.status) {
  //       console.log("Success")
  //     } else {
  //       console.log("Failure")
  //   }
  //   }


  const getNodeKey = ({ treeIndex }) => treeIndex;
    const getRandomName = () =>
      firstNames[Math.floor(Math.random() * firstNames.length)];
    return (
      <div>
        <div style={{ height: 300 }}>
          <SortableTree
            treeData={treeData}
            onChange={(treeData) => changeTreeData(treeData)}
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
          onClick={() =>addMoreData()}
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
