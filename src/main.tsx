import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

type TabKey = 'school' | 'tutoring' | 'life' | 'profile'
type ThemeKey = 'ocean' | 'sunshine' | 'forest' | 'grape'

const tabs: Array<{
  key: TabKey
  label: string
  title: string
  description: string
  items: string[]
}> = [
  {
    key: 'school',
    label: '校内学习',
    title: '校内学习安排',
    description: '记录每天的课程、作业、考试和老师提醒，帮助孩子养成清晰的学习节奏。',
    items: ['今日课程表', '家庭作业清单', '考试与测验提醒', '老师通知记录'],
  },
  {
    key: 'tutoring',
    label: '校外补习',
    title: '校外补习计划',
    description: '管理兴趣班、补习班和课后练习，让校外安排一目了然。',
    items: ['补习课程时间', '课后练习任务', '兴趣班安排', '费用与续课提醒'],
  },
  {
    key: 'life',
    label: '日常生活',
    title: '日常生活管理',
    description: '关注作息、饮食、运动和家务习惯，帮助孩子平衡学习与生活。',
    items: ['起床与睡觉时间', '每日运动打卡', '阅读与休息计划', '家务和习惯养成'],
  },
  {
    key: 'profile',
    label: '我的主页',
    title: '我的主页',
    description: '集中展示孩子的基本信息、成长目标、兴趣爱好和阶段性进步。',
    items: ['基本信息', '兴趣爱好', '本学期目标', '成长记录'],
  },
]

const themes: Array<{
  key: ThemeKey
  label: string
}> = [
  { key: 'ocean', label: '清新蓝' },
  { key: 'sunshine', label: '阳光橙' },
  { key: 'forest', label: '成长绿' },
  { key: 'grape', label: '梦幻紫' },
]

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('school')
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('ocean')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const currentTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[0]

  return (
    <main className={`app-shell theme-${activeTheme}`}>
      <section className="dashboard-card">
        <div className="top-bar">
          <div className="page-header">
            <p className="eyebrow">小学生日常生活管理</p>
            <h1>让学习、补习和生活安排更清楚</h1>
            <p className="description">
              用一个简单的首页，集中查看孩子校内学习、校外补习、日常生活和我的主页信息。
            </p>
          </div>

          <button
            className="settings-button"
            onClick={() => setIsSettingsOpen(true)}
            type="button"
            aria-label="进入设置页面"
          >
            <span aria-hidden="true">⚙</span>
          </button>
        </div>

        {isSettingsOpen ? (
          <section className="settings-page">
            <button className="back-button" onClick={() => setIsSettingsOpen(false)} type="button">
              ← 返回首页
            </button>
            <div className="settings-panel">
              <div>
                <p className="eyebrow">页面设置</p>
                <h2>设置</h2>
                <p>在这里调整网站的显示偏好，让页面更符合孩子喜欢的风格。</p>
              </div>

              <section className="theme-picker" aria-label="配色方案选择">
                <label htmlFor="theme-select">配色方案</label>
                <select
                  id="theme-select"
                  value={activeTheme}
                  onChange={(event) => setActiveTheme(event.target.value as ThemeKey)}
                >
                  {themes.map((theme) => (
                    <option key={theme.key} value={theme.key}>
                      {theme.label}
                    </option>
                  ))}
                </select>
              </section>
            </div>
          </section>
        ) : (
          <>
            <nav className="tab-list" aria-label="首页模块切换">
              {tabs.map((tab) => (
                <button
                  className={tab.key === activeTab ? 'tab-button active' : 'tab-button'}
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <section className="tab-panel">
              <div>
                <h2>{currentTab.title}</h2>
                <p>{currentTab.description}</p>
              </div>

              <div className="feature-grid">
                {currentTab.items.map((item) => (
                  <article className="feature-card" key={item}>
                    <span aria-hidden="true">✓</span>
                    <strong>{item}</strong>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
