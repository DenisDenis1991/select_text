import { Card } from './components'
import './style.scss'

import { ConfigProvider } from 'antd'

function App() {

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Radio: {
              buttonSolidCheckedActiveBg: 'var(--gray)',
              buttonSolidCheckedBg: 'var(--gray)',
              buttonSolidCheckedColor: 'var(--black)',
              buttonSolidCheckedHoverBg: 'var(--gray)',
              buttonPaddingInline: 30,
            }
          },
        }}
      >
        <Card />
      </ConfigProvider>
    </>
  )
}

export default App
