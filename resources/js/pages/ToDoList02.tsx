import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string;
}

interface TodoList {
  id: number;
  name: string;
  todos: Todo[];
}

const App: React.FC = () => {
  const [lists, setLists] = useState<TodoList[]>([
    {
      id: Date.now(),
      name: 'My First List',
      todos: [
        { id: 1, text: 'Meet client', completed: true, dueDate: '2025-04-26' },
        { id: 2, text: 'Update app content', completed: true, dueDate: '2025-04-27' },
        { id: 3, text: 'Review contract', completed: false, dueDate: '2025-04-28' },
      ],
    },
  ]);
  const [newListName, setNewListName] = useState('');

  // สร้าง List ใหม่
  const addList = () => {
    if (!newListName.trim()) return;
    setLists([
      ...lists,
      { id: Date.now(), name: newListName.trim(), todos: [] },
    ]);
    setNewListName('');
  };

  // ลบ List
  const deleteList = (listId: number) => {
    setLists(lists.filter(l => l.id !== listId));
  };

  // เพิ่ม / ติ๊ก / ลบ Todo
  const addTodo = (listId: number, text: string, dueDate: string) => {
    setLists(lists.map(l =>
      l.id === listId
        ? {
            ...l,
            todos: [
              ...l.todos,
              { id: Date.now(), text, dueDate, completed: false },
            ],
          }
        : l
    ));
  };

  const toggleTodo = (listId: number, todoId: number) => {
    setLists(lists.map(l =>
      l.id === listId
        ? {
            ...l,
            todos: l.todos.map(t =>
              t.id === todoId ? { ...t, completed: !t.completed } : t
            ),
          }
        : l
    ));
  };

  const deleteTodo = (listId: number, todoId: number) => {
    setLists(lists.map(l =>
      l.id === listId
        ? { ...l, todos: l.todos.filter(t => t.id !== todoId) }
        : l
    ));
  };

  // **แก้ไข Todo** ด้วย prompt()
  const editTodo = (listId: number, todoId: number) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    const todo = list.todos.find(t => t.id === todoId);
    if (!todo) return;

    const newText = prompt('Edit task text:', todo.text);
    const newDue  = prompt('Edit due date (YYYY-MM-DD):', todo.dueDate);
    if (newText != null && newText.trim() && newDue) {
      setLists(lists.map(l =>
        l.id === listId
          ? {
              ...l,
              todos: l.todos.map(t =>
                t.id === todoId
                  ? { ...t, text: newText.trim(), dueDate: newDue }
                  : t
              ),
            }
          : l
      ));
    }
  };

  // helper แปลง YYYY-MM-DD → DD/MM/YYYY
  const formatDate = (s: string) => {
    const [y, m, d] = s.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.mainHeading}>Multi To-Do Lists</h1>

      {/* สร้าง List ใหม่ */}
      <div style={styles.newListBox}>
        <input
          type="text"
          placeholder="New list name"
          value={newListName}
          onChange={e => setNewListName(e.target.value)}
          style={styles.input}
        />
        <button onClick={addList} style={styles.addButton}>
          + Create List
        </button>
      </div>

      {/* รายการแต่ละ List */}
      <div style={styles.listsWrapper}>
        {lists.map(list => (
          <div key={list.id} style={styles.listContainer}>
            <div style={styles.listHeader}>
              <h2 style={styles.listHeading}>{list.name}</h2>
              <button
                onClick={() => deleteList(list.id)}
                style={styles.deleteListButton}
              >
                🗑️
              </button>
            </div>

            {list.todos.map(todo => (
              <div
                key={todo.id}
                style={{
                  ...styles.todoItem,
                  backgroundColor: todo.completed ? '#e8f5e9' : '#f9f9f9',
                }}
              >
                <span
                  style={styles.icon}
                  onClick={() => toggleTodo(list.id, todo.id)}
                >
                  {todo.completed ? '✅' : '⭕'}
                </span>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#4caf50' : '#333',
                    }}
                  >
                    {todo.text}
                  </div>
                  <div style={styles.due}>
                    Due: {formatDate(todo.dueDate)}
                  </div>
                </div>

                <button
                  onClick={() => deleteTodo(list.id, todo.id)}
                  style={styles.deleteButton}
                >
                  🗑️
                </button>
                <button
                  onClick={() => editTodo(list.id, todo.id)}
                  style={styles.editButton}
                >
                  ✏️
                </button>
              </div>
            ))}

            {/* ฟอร์มเพิ่ม Todo ใหม่ */}
            <AddTodoForm listId={list.id} onAdd={addTodo} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ฟอร์มย่อยสำหรับ Add Todo
const AddTodoForm: React.FC<{
  listId: number;
  onAdd: (listId: number, text: string, dueDate: string) => void;
}> = ({ listId, onAdd }) => {
  const [text, setText] = useState('');
  const [due, setDue] = useState('');

  const submit = () => {
    if (!text.trim() || !due) return;
    onAdd(listId, text.trim(), due);
    setText('');
    setDue('');
  };

  return (
    <div style={styles.newTaskBox}>
      <span style={styles.icon}>➕</span>
      <input
        type="text"
        placeholder="Create a new task"
        value={text}
        onChange={e => setText(e.target.value)}
        style={styles.input}
      />
      <input
        type="date"
        value={due}
        onChange={e => setDue(e.target.value)}
        style={styles.dateInput}
      />
      <button onClick={submit} style={styles.smallAddButton}>
        Add
      </button>
    </div>
  );
};

const styles: { [k: string]: React.CSSProperties } = {
  container: {
    maxWidth: 1000,
    margin: '40px auto',
    padding: 20,
    fontFamily: 'sans-serif',
  },
  mainHeading: {
    textAlign: 'center',
    marginBottom: 24,
  },
  newListBox: {
    display: 'flex',
    gap: 8,
    marginBottom: 32,
  },
  listsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',  // This ensures the lists wrap to the next line if space is not enough
    gap: 16,
  },
  listContainer: {
    width: 'calc(33.33% - 16px)', // Each list will take up 1/3 of the container width, with spacing between
    marginBottom: 32,
    padding: 16,
    border: '1px solid #ddd',
    borderRadius: 8,
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  listHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listHeading: {
    margin: 0,
  },
  deleteListButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    color: '#c62828',
  },
  todoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  icon: {
    fontSize: 18,
    marginTop: 4,
    cursor: 'pointer',
  },
  due: {
    fontSize: 12,
    color: '#777',
  },
  deleteButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 16,
    color: '#c62828',
    marginLeft: 8,
  },
  editButton: {
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 16,
    color: '#ffa500',
    marginLeft: 4,
  },
  newTaskBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    borderTop: '1px dashed #ccc',
    paddingTop: 12,
  },
  input: {
    flex: 1,
    padding: 6,
    fontSize: 14,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  dateInput: {
    padding: 6,
    fontSize: 14,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  addButton: {
    padding: '6px 12px',
    fontSize: 14,
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  smallAddButton: {
    padding: '4px 10px',
    fontSize: 14,
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

export default App;
