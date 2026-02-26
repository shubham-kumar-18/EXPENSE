import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";
import { formatCurrency } from "../utils/format.js";

const AIInsights = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/api/expenses");
        setExpenses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const insights = useMemo(() => {
    if (!expenses.length) {
      return {
        suggestions: [],
        totals: {},
        top: null,
        totalSpent: 0,
        average: 0
      };
    }
    const totals = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const top = entries[0];
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const average = totalSpent / expenses.length;

    const suggestions = [];
    if (top) {
      suggestions.push(`Top category: ${top[0]} (${formatCurrency(top[1])})`);
      if (top[0].toLowerCase().includes("food")) {
        suggestions.push("Consider setting a weekly meal budget to reduce food expenses.");
      }
      if (top[0].toLowerCase().includes("shopping")) {
        suggestions.push("You spend more on shopping. Plan purchases before checkout.");
      }
    }
    if (average > 100) {
      suggestions.push("Your average expense is high. Review recurring costs.");
    } else {
      suggestions.push("Your average expense is stable. Keep tracking for trends.");
    }
    return { suggestions, totals, top, totalSpent, average };
  }, [expenses]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <section className="card p-6 bg-white/90">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Expense AI</p>
            <h2 className="text-2xl font-display font-semibold">Smart Insights</h2>
            <p className="text-sm text-slate-500 mt-1">Rule-based signals to help you spend better.</p>
          </div>
          {insights.top && (
            <div className="rounded-2xl bg-ink text-white px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-white/60">Top Category</p>
              <p className="text-base font-semibold">{insights.top[0]}</p>
              <p className="text-sm text-white/80">{formatCurrency(insights.top[1])}</p>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Spent", value: formatCurrency(insights.totalSpent) },
          { label: "Average Expense", value: formatCurrency(insights.average) },
          { label: "Categories", value: Object.keys(insights.totals || {}).length }
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
            <p className="text-xl font-semibold text-ink mt-2">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Insights Feed</h3>
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : insights.suggestions.length ? (
            <div className="space-y-3">
              {insights.suggestions.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent"></span>
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Add expenses to unlock insights.</p>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Category Signals</h3>
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : insights.top ? (
            <div className="space-y-3 text-sm">
              {Object.entries(insights.totals)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-slate-600">{category}</span>
                    <span className="font-semibold text-ink">{formatCurrency(amount)}</span>
                  </div>
                ))}
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                Top categories are ranked by total spending.
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No category data yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AIInsights;
