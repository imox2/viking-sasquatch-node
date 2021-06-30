import React from 'react';
import SortableTree from 'react-sortable-tree';
import {
    addNodeUnderParent,
    removeNodeAtPath,
    changeNodeAtPath,
    findTotalNodes
} from './utils/tree-data-utils';
import {
    getRandomNumber
} from './utils/common';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import {
    ToastContainer,
    toast
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socketIOClient from "socket.io-client";

const ENDPOINT =
  process.env.REACT_APP_ENV === "prod"
    ? "https://ksapid.com/tree-api"
    : "http://localhost:3000/tree-api";

const SOCKET_ENDPOINT =
  process.env.REACT_APP_ENV === "prod"
    ? "https://ksapid.com"
    : "http://localhost:3000";

function App() {
    const [autoAddChildren, setAutoAddChildren] = React.useState(false);
    const [lowerBound, setLowerBound] = React.useState('');
    const [treeId, setTreeId]  = React.useState('');
    const [upperBound, setUpperBound] = React.useState('');
    const [maxDepth, setMaxDepth] = React.useState(0);
    const [numberOfChildren, setNumberOfChildren] = React.useState('');
    const [treeData, setTreeData] = React.useState([]);

    React.useEffect(() => {
        const socket = socketIOClient(SOCKET_ENDPOINT);
        socket.on("tree_change", data => {
            setTreeData(JSON.parse(data.data));
            setTreeId(data._id);
        });
        const fetchData = async () => {
            let response = await fetch(ENDPOINT + "/tree", {
                method: "GET",
            });
            const data = await response.json();
            setTreeData(data.data);
            if(data._id) {
              setTreeId(data._id);
            }
            // setTreeData([{ name: 'Root' },]);
        }
        setMaxDepth(3);
        fetchData();
    }, []);

    const showToast = msg => {
        toast(msg, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const addFactoryData = () => {
        let data = [];
        if (autoAddChildren) {
            // need bounds
            if (!lowerBound || !upperBound || !numberOfChildren || numberOfChildren === 0) {
                showToast("Please add lower bound and upper bound of random numbers and number of children before adding factory")
            } else if (upperBound <= 0 || lowerBound <= 0 || (upperBound - lowerBound) < 15 || parseInt(numberOfChildren) > parseInt(maxDepth)) {
                showToast(`upperBound and lowerBound numbers must be positive, difference should be over 15 and max number of children must be upto ${maxDepth}`);
            } else {
                // add factory and then add childrens to factory node
                let newData = treeData.concat({
                    name: `Node ${treeData.length}`,
                })
                const parentKey = (findTotalNodes(newData,0))-1;
                for (let i = 0; i < numberOfChildren; i++) {
                    newData = addNodeUnderParent({
                        treeData: newData,
                        parentKey: parentKey,
                        expandParent: true,
                        getNodeKey,
                        newNode: {
                            name: `${getRandomNumber(parseInt(lowerBound),parseInt(upperBound))}`,
                        },
                    }).treeData
                }
                data = newData;
            }
        } else {
            // add factory
            data = treeData.concat({
                name: `Node ${treeData.length}`,
            })
        }
        if (data.length > 0) {
            setTreeData(data);
            setData(data);
        }
    }

    const setData = async treeData => {
      let endpoint = ENDPOINT + "/tree" 
      endpoint = endpoint + (treeId ? "/"+treeId : "");
        let response = await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify({
                data: treeData
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
        return response;
    };
    
    const getNodeKey = ({
        treeIndex
    }) => treeIndex;
    return ( 
        <div className="mx-28 mt-4 bg-white">
   <ToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      />
   <div className="flex flex-col items-start text-center">
      <div className=" flex flex-row mt-4 ">
         <div className=" flex flex-row mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" >
            Lower bound of random number
            </label>
            <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" placeholder="lower bound" value={lowerBound} onChange={(event)=>setLowerBound(event.target.value)}/>
         </div>
         <div className=" flex flex-row mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" >
            upper bound of random number
            </label>
            <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username"  placeholder="upper bound" value={upperBound} onChange={(event)=>setUpperBound(event.target.value)}/>
         </div>
      </div>
      <div className=" flex flex-row mb-4">
         <label className="block text-gray-700 text-sm font-bold mb-2 mr-4 pr-2">
         number of childrens to add
         </label>
         <input type="number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" placeholder="number of children" value={numberOfChildren} onChange={(event)=>setNumberOfChildren(event.target.value)}/>
      </div>
      <div className="flex">
         <div className="ml-3 text-sm">
            <label htmlFor="comments" className="font-medium text-gray-700">
            Automatically add childrens to factory
            </label>
         </div>
         <div className="flex items-center pl-4 h-5">
            <input
               id="childrens-check"
               name="childrens-check"
               type="checkbox"
               onChange={(event)=>setAutoAddChildren(event.target.value)} 
            checked={autoAddChildren}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
         </div>
      </div>
      <div className="mb-2 mt-2"><button onClick={() =>addFactoryData()} className="px-5 py-3 rounded-xl text-sm font-medium text-indigo-600 bg-white outline-none focus:outline-none m-1 hover:m-0 focus:m-0 border border-indigo-600 hover:border-4 focus:border-4 hover:border-indigo-800 hover:text-indigo-800 focus:border-purple-200 active:border-grey-900 active:text-grey-900 transition-all">Add Factory</button></div>
   </div>
   <div style={{ height: 800}}>
   <SortableTree
      treeData={treeData}
      onChange={treeData => setTreeData(treeData)}
      generateNodeProps={({ node, path }) => ({
         title: (
         <input
         style={{ fontSize: '1.1rem' }}
         value={node.name}
         onChange={event => {
           const name = event.target.value;
           const newTreeData = changeNodeAtPath({
           treeData: treeData,
           path,
           getNodeKey,
           newNode: { ...node, name },
           });
           setTreeData(newTreeData);
           if(name) {
              setData(newTreeData)
           } else {
              showToast("Node name cannot be empty. Not saved!");
           }}
         }
         />
        ),
         buttons: [
         <button
            className="mr-4 px-5 py-1 rounded-xl text-sm font-medium text-indigo-600 bg-white outline-none focus:outline-none m-1 hover:m-0 focus:m-0 border border-indigo-600 hover:border-4 focus:border-4 hover:border-indigo-800 hover:text-indigo-800 focus:border-purple-200 active:border-grey-900 active:text-grey-900 transition-all"
            onClick={() =>{
              let newData = '';
               if(node.children) {
                 if(node.children.length<maxDepth) {
                  newData = addNodeUnderParent({
                     treeData: treeData,
                     parentKey: path[path.length - 1],
                     expandParent: true,
                     getNodeKey,
                     newNode: {
                     name: `${getRandomNumber(1,1000)}`,
                     },
                     }).treeData;
                   setTreeData(newData);
                 } else {
                  showToast(`Cant add more than ${maxDepth} children at one node`)
                 }
               } else {
                 newData = addNodeUnderParent({
                     treeData: treeData,
                     parentKey: path[path.length - 1],
                     expandParent: true,
                     getNodeKey,
                     newNode: {
                     name: `${getRandomNumber(1,1000)}`,
                     },
                     }).treeData;
                   setTreeData(newData);
                 }
                 if(newData) {
                  setData(newData);
                 }
               }
            }
         > Add Child </button>,
         <button
            className="mr-4 px-5 py-1 rounded-xl text-sm font-medium text-indigo-600 bg-white outline-none focus:outline-none m-1 hover:m-0 focus:m-0 border border-indigo-600 hover:border-4 focus:border-4 hover:border-indigo-800 hover:text-indigo-800 focus:border-purple-200 active:border-grey-900 active:text-grey-900 transition-all"
            onClick={() => {
              let newData = removeNodeAtPath({
               treeData: treeData,
               path,
               getNodeKey,
               });
              setTreeData(newData);
              setData(newData);
            }
         }
         > Remove </button>,
         ],
    })}
   />
</div>
</div>
    );
}

export default App;