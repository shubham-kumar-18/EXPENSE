import React from "react";
import { formatCurrency } from "../utils/format.js";

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  return (
    <div className="card p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{new Date(expense.date).toLocaleDateString()}</p>
        <h3 className="text-base font-semibold text-ink">{expense.title}</h3>
        <p className="text-xs text-slate-500">{expense.category}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-base font-semibold text-ember">{formatCurrency(expense.amount)}</span>
        <button className="btn-secondary" onClick={() => onEdit(expense)}>
          Edit
        </button>
        <button className="btn-secondary" onClick={() => onDelete(expense._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
