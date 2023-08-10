import { defineComponent, reactive } from 'vue'
import { GlobalFooter } from '@gx-design/ProLayout'
import LOGO from '@/assets/logo.png'
import { useStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { Form } from 'ant-design-vue'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useMemo } from '@/hooks/core'
import * as style from './utils/config'

interface UserState {
  userName?: string
  password?: string
  autoLogin?: boolean
}

interface loginState {
  redirect: string
  dependencies: RecordType
  devDependencies: RecordType
}

export default defineComponent({
  components: { GlobalFooter },
  setup() {
    const { pkg, lastBuildTime } = __APP_INFO__
    console.log('版本: ', pkg.version)
    console.log('项目构建时间: ', lastBuildTime)

    const useForm = Form.useForm
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const userForm = reactive({
      userName: '',
      password: '',
      autoLogin: false
    } as UserState)

    const userRules = reactive({
      userName: [{ required: true, message: '用户名是必填项！' }],
      password: [{ required: true, message: '密码是必填项！' }]
    })

    const state: loginState = reactive({
      redirect: undefined,
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies
    })

    const title = computed(() => store.settings.title)
    const { validate, validateInfos } = useForm(userForm, userRules)

    watch(
      () => route.fullPath,
      () => {
        state.redirect = (route.query?.redirect as string) || '/'
      },
      {
        deep: true,
        immediate: true
      }
    )

    const handleRoute = () => {
      return state.redirect === '/exception/404' || state.redirect === '/exception/403'
        ? '/'
        : state.redirect
    }

    const handleSubmit = () => {
      validate()
        .then(async (value) => {
          const response: any = await store.user.userLogin({ ...value })
          if (response) {
            await router.push(handleRoute())
          }
        })
        .catch((_) => {})
    }

    /** 生成logo 的dom，如果是string 设置为图片 如果是个 dom 就原样保留 */
    const logoDom = useMemo(() => {
      if (typeof LOGO === 'string') {
        return <img style={{ width: '100%' }} src={LOGO} />
      }
      return null
    })

    return () => {
      return (
        <div style={style.loginContainerCSS}>
          <div style={style.contentCSS}>
            <div style={style.loginFormContainerCSS}>
              <div style={style.loginFormContainerTopCSS}>
                <div style={style.loginFormContainerTopHeaderCSS}>
                  <span style={style.loginFormContainerTopHeaderLogoCSS}>{logoDom.value}</span>
                  <span style={style.loginFormContainerTopHeaderTitleCSS}>{title.value}</span>
                </div>
              </div>
              <div style={style.loginFormContainerMainCSS}>
                <a-form>
                  <a-form-item {...validateInfos.userName}>
                    <a-input
                      name="userName"
                      size="large"
                      v-model:value={userForm.userName}
                      placeholder="用户名"
                      v-slots={{
                        prefix: () => {
                          return <UserOutlined />
                        }
                      }}
                    ></a-input>
                  </a-form-item>
                  <a-form-item {...validateInfos.password}>
                    <a-input-password
                      name="password"
                      size="large"
                      v-model:value={userForm.password}
                      placeholder="密码"
                      v-slots={{
                        prefix: () => {
                          return <LockOutlined />
                        }
                      }}
                    ></a-input-password>
                  </a-form-item>
                  <a-form-item style="margin-bottom: 24px">
                    <a-checkbox noStyle name="autoLogin" v-model:checked={userForm.autoLogin}>
                      记住密码
                    </a-checkbox>
                    <a-tooltip
                      v-slots={{
                        title: () => {
                          return '联系管理员'
                        }
                      }}
                    >
                      <a style="float: right">忘记密码</a>
                    </a-tooltip>
                  </a-form-item>
                  <a-form-item>
                    <a-button
                      htmlType="submit"
                      type="primary"
                      block
                      size="large"
                      onClick={() => handleSubmit()}
                    >
                      登录
                    </a-button>
                  </a-form-item>
                </a-form>
              </div>
            </div>
          </div>
          <GlobalFooter />
        </div>
      )
    }
  }
})
