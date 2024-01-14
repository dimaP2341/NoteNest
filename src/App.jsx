import { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import logo from '/public/logo.svg';

Form.propTypes = {
  handleAddToList: PropTypes.func.isRequired,
  // handleToggleItem: PropTypes.func.isRequired,
};

List.propTypes = {
  items: PropTypes.array.isRequired,
  // handleToggleItem: PropTypes.func.isRequired,
  handleDeleteItem: PropTypes.func.isRequired,
  handleSortedItem: PropTypes.func.isRequired,
  handleClearItems: PropTypes.func.isRequired,
  handleCheckedItem: PropTypes.func.isRequired,
};

Item.propTypes = {
  item: PropTypes.object.isRequired,
  // handleToggleItem: PropTypes.func.isRequired,
  handleDeleteItem: PropTypes.func.isRequired,
  handleCheckedItem: PropTypes.func.isRequired,
};

function App() {
  const [items, setItems] = useState(() => {
    const storedItems = window.localStorage.getItem('items');
    return storedItems ? JSON.parse(storedItems) : [];
  });

  function handleAddToList(item) {
    setItems(items => [...items, item]);
  }

  function handleDeleteItem(id) {
    setItems((currentItems) => {
      const updatedItems = currentItems.filter((item) => item.id !== id);
      localStorage.setItem('items', JSON.stringify(updatedItems));
      return updatedItems;
    });
  }

  function handleSortedItem() {
    setItems((items) => [...items].sort((a, b) => a.description.localeCompare(b.description)));
  }  

  function handleClearItems() {
    setItems([]);
  }

  function handleCheckedItem(id) {
    setItems((items) => items.map((item) => item.id === id ? {...item, package: !item.package} : item))
  }

  useEffect(() => {
    // Save data to localStorage whenever items change
    window.localStorage.setItem('items', JSON.stringify(items));
  }, [items]); // Run this effect whenever items change

  return (
    <div className="app">
      <Header />
      <Form handleAddToList={handleAddToList}/>
      <List handleCheckedItem={handleCheckedItem} handleClearItems={handleClearItems} handleSortedItem={handleSortedItem} handleDeleteItem={handleDeleteItem} items={items}/>
      <Footer/>
    </div>
  )
}

function Header() {
  return (
    <div className="header">
      <img height={100} src={logo} alt="Logo" />
      <div className="title">NoteNest</div>
    </div>
  )
}

function Form({ handleAddToList }) {
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState(0)

  function handleSublit(e) {
    e.preventDefault();

    if(!description) return;

    const newItem = {description, quantity, package: false, id: Date.now()}

    handleAddToList(newItem);

    setDescription('');
    setQuantity(0);
  }

  return (
    <form className="form" onSubmit={handleSublit}>
      <label htmlFor="quantity">Input Quantity</label>
      <input name="quantity" id="quantity" type="number" placeholder="Quantity" value={quantity} onChange={e=>setQuantity(e.target.value)}/>
      <label htmlFor="item">Input what you need</label>
      <input type="text" id="item" name="item" placeholder="Item"  value={description} onChange={e=> setDescription(e.target.value)}/>
      <button className="btn">Add</button>
    </form>
  )
}

function List({items, handleDeleteItem, handleSortedItem, handleClearItems, handleCheckedItem}) {
  const displayItems = items;

  return (
    <div className="list">
      <ul>
        {displayItems.map(item => (
          <Item handleCheckedItem={handleCheckedItem} item={item} handleDeleteItem={handleDeleteItem} key={item.id}/>
        ))}
      </ul>
      <div className="btn-container">
        <button onClick={handleSortedItem} className="btn-sorted">Sort</button>
        <button onClick={handleClearItems} className="btn-clear">Clear</button>
      </div>
    </div>
  )
}

function Item({item, handleDeleteItem, handleCheckedItem}) {
  return (
    <li>
      <input onClick={() =>handleCheckedItem(item.id)} type="checkbox" checked={item.package}/>
      <span className={item.package === true ? 'checked' : 'unchecked'}><span className="quantity-color">{item.quantity}</span> {item.description}</span>
      <button className="btn-close" onClick={() => handleDeleteItem(item.id)}> &#10006;</button>
    </li>
    )
}

function Footer() {
  return(
    <div className="footer">©️ 2024 Plotkin Dmytro. All Rights Reserved</div>
  )
}

export default App;