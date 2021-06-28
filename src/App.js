import React from 'react';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app

function App() {
  const [treeData, setTreeData] = React.useState(false);
  React.useEffect(() => {
     const treeData = [
        { title: 'Chicken', children: [{ title: 'Egg' }] },
        { title: 'Fish', children: [{ title: 'fingerline' }] },
      ];
      setTreeData(treeData);
  }, []);


  return (
    <div className="App">
      <div style={{ height: 400 }}>
        <SortableTree
          treeData={treeData}
          onChange={treeData => setTreeData( treeData )}
        />
      </div>
    </div>
  );
}

export default App;
