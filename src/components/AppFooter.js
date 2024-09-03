import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 text-center">
      <div>
        <span>SalaMOM</span>
        <span className="ms-1">&copy; 2024</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
