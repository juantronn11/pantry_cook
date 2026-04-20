// ShoppingListPage — displays ingredients the user needs to buy
// Owner: Patrick Rucker

import { useAuth0 } from '@auth0/auth0-react'
import AccessButton from '../components/AccessButtons/AccessButton'
import ShoppingList from '../components/ShoppingList/ShoppingList'

function ShoppingListPage() {
  const { isAuthenticated } = useAuth0()

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', gap: '1rem' }}>

        <p>Not Logged in!</p>
        <p>Please sign in to access your shopping list</p>

        <AccessButton variant="page"/>
      </div>
    )
  }

  return <ShoppingList/>
}

export default ShoppingListPage
