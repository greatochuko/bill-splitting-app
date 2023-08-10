import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [addFriendForm, setAddFriendForm] = useState(false);
  const [friendList, setFriendList] = useState(initialFriends);
  const [currentFriendId, setCurrentFriendId] = useState(null);

  function toggleAddFriendForm() {
    setAddFriendForm((formerstate) => !formerstate);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friendList={friendList}
          setCurrentFriendId={setCurrentFriendId}
          currentFriendId={currentFriendId}
        />
        {addFriendForm && (
          <AddFriendForm
            setFriendList={setFriendList}
            setAddFriendForm={setAddFriendForm}
          />
        )}
        {!addFriendForm ? (
          <Button onClick={toggleAddFriendForm}>Add Friend</Button>
        ) : (
          <Button onClick={toggleAddFriendForm}>Close</Button>
        )}
      </div>
      {currentFriendId !== null && (
        <SplitBillForm
          id={currentFriendId}
          friendList={friendList}
          setFriendList={setFriendList}
        />
      )}
    </div>
  );
}

function Button({ onClick, children, type }) {
  return (
    <button className="button" onClick={onClick} type={type}>
      {children}
    </button>
  );
}

function Friend({ friend, setCurrentFriendId, friendList, currentFriendId }) {
  function handleSplitBillForm() {
    if (currentFriendId !== friendList.indexOf(friend)) {
      setCurrentFriendId(friendList.indexOf(friend));
      return;
    }
    setCurrentFriendId(null);
  }

  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <div>
        <h3>{friend.name}</h3>
        {friend.balance === 0 ? (
          <p>You and {friend.name} are even</p>
        ) : friend.balance > 0 ? (
          <p className="green">
            {friend.name} owes you £{friend.balance}
          </p>
        ) : (
          <p className="red">
            You owe {friend.name} £{Math.abs(friend.balance)}
          </p>
        )}
      </div>
      {currentFriendId !== friendList.indexOf(friend) ? (
        <Button onClick={handleSplitBillForm}>Select</Button>
      ) : (
        <Button onClick={handleSplitBillForm}>Close</Button>
      )}
    </li>
  );
}

function FriendList({ friendList, setCurrentFriendId, currentFriendId }) {
  return (
    <ul>
      {friendList.map((friend) => (
        <Friend
          key={friendList.indexOf(friend)}
          friend={friend}
          setCurrentFriendId={setCurrentFriendId}
          friendList={friendList}
          currentFriendId={currentFriendId}
        />
      ))}
    </ul>
  );
}

function AddFriendForm({ setFriendList, setAddFriendForm }) {
  const [name, setName] = useState("");
  const [imageURL, setimageURL] = useState("https://i.pravatar.cc/48?u=");

  function addFriend(e) {
    e.preventDefault();
    const id = Math.round(Math.random() * 1000000);
    const newFriend = { id, name: name, image: imageURL + id, balance: 0 };
    setFriendList((formerList) => [...formerList, newFriend]);
    setAddFriendForm(false);
  }

  return (
    <form className="form-add-friend" onSubmit={addFriend}>
      <label>
        <span>👫</span> Friend name
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>
        <span>🌄</span> Image URL
      </label>
      <input
        type="text"
        value={imageURL}
        onChange={(e) => setimageURL(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function SplitBillForm({ id, friendList, setFriendList }) {
  const [billValue, setBillValue] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const netBalance = billValue - yourExpense;

  const currentFriend = friendList[id];
  function handleSplitBill(e) {
    e.preventDefault();
    const newBalance = currentFriend.balance + netBalance;
    const newFriendList = friendList.slice();
    newFriendList[id].balance = newBalance;
    setFriendList(newFriendList);

    setBillValue("");
    setYourExpense("");
  }

  function handleWriteOff(e) {
    e.preventDefault();
    const newFriendList = friendList.slice();
    newFriendList[id].balance = 0;
    setFriendList(newFriendList);

    setBillValue("");
    setYourExpense("");
  }

  return (
    <form className="form-split-bill" onSubmit={handleSplitBill}>
      <label>
        <span>💰</span> Bill value
      </label>
      <input
        type="number"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />
      <label>
        <span>🧍‍♀️</span> Your exprense
      </label>
      <input
        type="number"
        value={yourExpense}
        onChange={(e) => setYourExpense(Number(e.target.value))}
      />
      <label>
        <span>👫</span> {currentFriend.name}'s expense
      </label>
      <input type="number" disabled={true} value={netBalance} />
      <label>
        <span>🤑</span> Who's paying the bill?
      </label>
      <select>
        <option>You</option>
        <option>{currentFriend.name}</option>
      </select>
      <div className="button-group">
        <Button type="none" onClick={handleWriteOff}>
          Write off bill
        </Button>
      </div>
      <div className="button-group">
        <Button>Split bill</Button>
      </div>
    </form>
  );
}
