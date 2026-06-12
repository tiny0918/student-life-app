import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

type TabKey = 'school' | 'tutoring' | 'life' | 'profile'
type ThemeKey = 'ocean' | 'sunshine' | 'forest' | 'grape'
type SchoolFeatureKey = 'schedule' | 'homework' | 'exam' | 'notice'
type UploadedFile = {
  name: string
  type: string
  dataUrl: string
}

const scheduleFileStorageKey = 'student-life-app:schedule-file'
const routineFileStorageKey = 'student-life-app:routine-file'

const readStoredFile = (storageKey: string) => {
  const storedFile = localStorage.getItem(storageKey)

  if (!storedFile) {
    return null
  }

  try {
    return JSON.parse(storedFile) as UploadedFile
  } catch {
    localStorage.removeItem(storageKey)
    return null
  }
}

const schoolFeatures: Array<{
  key: SchoolFeatureKey
  label: string
  title: string
  description: string
  details: string[]
}> = [
  {
    key: 'schedule',
    label: '今日课程表',
    title: '今日课程表',
    description: '按时间顺序查看当天课程，提前准备课本、文具和课堂任务。',
    details: ['上午课程与上课时间', '下午课程与活动安排', '需要提前准备的学习用品'],
  },
  {
    key: 'homework',
    label: '家庭作业清单',
    title: '家庭作业清单',
    description: '集中记录各科作业，完成后逐项打勾，减少遗漏。',
    details: ['语文、数学、英语作业', '预计完成时间', '家长检查与订正提醒'],
  },
  {
    key: 'exam',
    label: '考试与测验提醒',
    title: '考试与测验提醒',
    description: '提前整理考试时间、范围和复习重点，帮助孩子从容准备。',
    details: ['近期测验日期', '复习内容和重点', '错题回顾计划'],
  },
  {
    key: 'notice',
    label: '老师通知记录',
    title: '老师通知记录',
    description: '保存老师发布的重要通知，方便家长随时查看和跟进。',
    details: ['班级活动通知', '资料提交提醒', '需要家长配合的事项'],
  },
]

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
  const [activeSchoolFeature, setActiveSchoolFeature] = useState<SchoolFeatureKey>('schedule')
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('ocean')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [scheduleFile, setScheduleFile] = useState<UploadedFile | null>(() =>
    readStoredFile(scheduleFileStorageKey),
  )
  const [routineFile, setRoutineFile] = useState<UploadedFile | null>(() =>
    readStoredFile(routineFileStorageKey),
  )
  const currentTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[0]
  const currentSchoolFeature =
    schoolFeatures.find((feature) => feature.key === activeSchoolFeature) ?? schoolFeatures[0]

  useEffect(() => {
    if (scheduleFile) {
      localStorage.setItem(scheduleFileStorageKey, JSON.stringify(scheduleFile))
    } else {
      localStorage.removeItem(scheduleFileStorageKey)
    }
  }, [scheduleFile])

  useEffect(() => {
    if (routineFile) {
      localStorage.setItem(routineFileStorageKey, JSON.stringify(routineFile))
    } else {
      localStorage.removeItem(routineFileStorageKey)
    }
  }, [routineFile])

  const readFileToState = (
    file: File,
    setCurrentFile: React.Dispatch<React.SetStateAction<UploadedFile | null>>,
    input: HTMLInputElement,
  ) => {
    const reader = new FileReader()

    reader.onload = () => {
      setCurrentFile({
        name: file.name,
        type: file.type,
        dataUrl: String(reader.result),
      })
      input.value = ''
    }

    reader.readAsDataURL(file)
  }

  const handleScheduleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      readFileToState(file, setScheduleFile, event.target)
    }
  }

  const handleRoutineFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      readFileToState(file, setRoutineFile, event.target)
    }
  }

  const deleteFile = (setCurrentFile: React.Dispatch<React.SetStateAction<UploadedFile | null>>) => {
    setCurrentFile(null)
  }

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

            <section className={activeTab === 'school' ? 'tab-panel school-panel' : 'tab-panel'}>
              {activeTab !== 'school' && (
                <div>
                  <h2>{currentTab.title}</h2>
                  <p>{currentTab.description}</p>
                </div>
              )}

              {activeTab === 'school' ? (
                <div className="school-feature-layout">
                  <nav className="school-feature-tabs" aria-label="校内学习功能切换">
                    {schoolFeatures.map((feature) => (
                      <button
                        className={
                          feature.key === activeSchoolFeature
                            ? 'school-feature-tab active'
                            : 'school-feature-tab'
                        }
                        key={feature.key}
                        onClick={() => setActiveSchoolFeature(feature.key)}
                        type="button"
                      >
                        {feature.label}
                      </button>
                    ))}
                  </nav>

                  <article className="school-feature-content">
                    {activeSchoolFeature === 'schedule' ? (
                      <section className="schedule-upload" aria-label="课程表和作息表上传">
                        <div className="upload-actions">
                          <label className="upload-icon-button" htmlFor="schedule-file">
                            <span aria-hidden="true">🖼️</span>
                            <strong>上传课程表</strong>
                          </label>
                          <input
                            accept="image/*,.pdf,application/pdf"
                            id="schedule-file"
                            onChange={handleScheduleFileChange}
                            type="file"
                          />

                          <label className="upload-icon-button" htmlFor="routine-file">
                            <span aria-hidden="true">🗓️</span>
                            <strong>上传作息表</strong>
                          </label>
                          <input
                            accept="image/*,.pdf,application/pdf"
                            id="routine-file"
                            onChange={handleRoutineFileChange}
                            type="file"
                          />
                        </div>

                        {(scheduleFile || routineFile) && (
                          <div className="upload-preview-grid">
                            {scheduleFile && (
                              <div className="schedule-preview">
                                <div className="schedule-file-info">
                                  <span aria-hidden="true">📄</span>
                                  <em>课程表</em>
                                  <strong>{scheduleFile.name}</strong>
                                  <button
                                    className="delete-upload-button"
                                    onClick={() => deleteFile(setScheduleFile)}
                                    type="button"
                                  >
                                    删除
                                  </button>
                                </div>

                                {scheduleFile.type.startsWith('image/') ? (
                                  <img alt="上传的课程表预览" src={scheduleFile.dataUrl} />
                                ) : (
                                  <a href={scheduleFile.dataUrl} rel="noreferrer" target="_blank">
                                    打开课程表 PDF
                                  </a>
                                )}
                              </div>
                            )}

                            {routineFile && (
                              <div className="schedule-preview">
                                <div className="schedule-file-info">
                                  <span aria-hidden="true">📄</span>
                                  <em>作息表</em>
                                  <strong>{routineFile.name}</strong>
                                  <button
                                    className="delete-upload-button"
                                    onClick={() => deleteFile(setRoutineFile)}
                                    type="button"
                                  >
                                    删除
                                  </button>
                                </div>

                                {routineFile.type.startsWith('image/') ? (
                                  <img alt="上传的作息表预览" src={routineFile.dataUrl} />
                                ) : (
                                  <a href={routineFile.dataUrl} rel="noreferrer" target="_blank">
                                    打开作息表 PDF
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </section>
                    ) : (
                      <>
                        <h3>{currentSchoolFeature.title}</h3>
                        <p>{currentSchoolFeature.description}</p>
                        <div className="feature-grid school-detail-grid">
                          {currentSchoolFeature.details.map((detail) => (
                            <article className="feature-card" key={detail}>
                              <span aria-hidden="true">✓</span>
                              <strong>{detail}</strong>
                            </article>
                          ))}
                        </div>
                      </>
                    )}
                  </article>
                </div>
              ) : (
                <div className="feature-grid">
                  {currentTab.items.map((item) => (
                    <article className="feature-card" key={item}>
                      <span aria-hidden="true">✓</span>
                      <strong>{item}</strong>
                    </article>
                  ))}
                </div>
              )}
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
