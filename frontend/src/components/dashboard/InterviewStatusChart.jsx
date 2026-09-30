import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export default function InterviewStatusChart({ scheduled, completed, cancelled }) {
  const data = [
    { name: 'Scheduled', value: scheduled, color: '#3b82f6' },
    { name: 'Completed', value: completed, color: '#22c55e' },
    { name: 'Cancelled', value: cancelled, color: '#ef4444' },
  ]
  const total = scheduled + completed + cancelled

  if (total === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No interviews yet
      </div>
    )
  }

  return (
    <div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="size-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}