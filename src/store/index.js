import { createStore } from 'vuex'
import settings from './modules/settings'
import favorite from './modules/favorite'
import g2048 from './modules/2048'
import tetris from './modules/tetris'
import user from './modules/user'
import VuexPersist from '@/plugins/VuexPersist'

export default createStore({
  modules: {
    settings,
    favorite,
    g2048,
    tetris,
    user
  },
  plugins: [VuexPersist({
    name: 'iszy_tools',
    storeName: 'state'
  })]
})
