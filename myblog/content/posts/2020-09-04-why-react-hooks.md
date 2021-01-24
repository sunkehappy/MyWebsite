---
date: 2020-09-04
category:       研发
title:          为什么要用React Hooks[翻译]
tags:           [React, React Hooks]
---

本文翻译自：[Why React Hooks?](https://dev.to/tylermcginnis/why-react-hooks-51lj)

任何你要学习新知识的时候，你都得问一下你自己两个问题：

* 为什么会有这东西？
* 它解决了什么问题？

如果你找不到让你信服的答案，那你后面学习的细节就没有一个坚实的基础。React Hooks的这两个问题就尤其有意思。在Hooks发布的时候React就已经是JavaScript生态系统中最流行也最受前端开发者喜爱的开发框架。但即使有了这么多赞誉，React开发团队还是认为开发和发布Hooks是有必要的。那这是为什么呢？想要更好的回答这两个问题，我们首先需要深入的看一下我们在老版本中是如何构建React应用的。

## createClass

如果你是用React足够早，那你一定对`React.createClass`很熟悉。这就是我们创建React类的方法，所有我们用来描述组件的信息都是以对象的形式传给`createClass`方法的。

```jsx
const ReposGrid = React.createClass({
  getInitialState () {
    return {
      repos: [],
      loading: true
    }
  },
  componentDidMount () {
    this.updateRepos(this.props.id)
  },
  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.updateRepos(this.props.id)
    }
  },
  updateRepos (id) {
    this.setState({ loading: true })

    fetchRepos(id)
      .then((repos) => this.setState({
        repos,
        loading: false
      }))
  },
  render() {
    const { loading, repos } = this.state

    if (loading === true) {
      return <Loading />
    }

    return (
      <ul>
        {repos.map(({ name, handle, stars, url }) => (
          <li key={name}>
            <ul>
              <li><a href={url}>{name}</a></li>
              <li>@{handle}</li>
              <li>{stars} stars</li>
            </ul>
          </li>
        ))}
      </ul>
    )
  }
})
```

`createClass`就是一个简单而且有效的创建React组件的方法。最初React使用这个方法的原因就是在当时JavaScript还没有内置的类系统。当然，后来就有了。ES6给我们带来了`class`关键字，以及原生的创建类的方法。这就让React的处境很棘手，要么逆着JavaScript的发展潮流继续使用`createClass`，要么按照EcmaScript的标准，拥抱类。历史证明他们选择了后者。


## React.Component
> 我们发现我们并不是在设计一个类系统，我们仅仅是想要用JavaScript的方式来创建类 - [React v0.13.0 Release]（https://reactjs.org/blog/2015/01/27/react-v0.13.0-beta-1.html）

React 0.13.0引入了让我们可以用原生JavaScript方法来创建类的API `React.Component`。站在EcmaScript标准的角度，这的确是一大进步。
```jsx
class ReposGrid extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      repos: [],
      loading: true
    }

    this.updateRepos = this.updateRepos.bind(this)
  }
  componentDidMount () {
    this.updateRepos(this.props.id)
  }
  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.updateRepos(this.props.id)
    }
  }
  updateRepos (id) {
    this.setState({ loading: true })

    fetchRepos(id)
      .then((repos) => this.setState({
        repos,
        loading: false
      }))
  }
  render() {
    if (this.state.loading === true) {
      return <Loading />
    }

    return (
      <ul>
        {this.state.repos.map(({ name, handle, stars, url }) => (
          <li key={name}>
            <ul>
              <li><a href={url}>{name}</a></li>
              <li>@{handle}</li>
              <li>{stars} stars</li>
            </ul>
          </li>
        ))}
      </ul>
    )
  }
}
```

虽然在正确的方向前进了一大步，`React.Component`并不是没有缺点。

### constructor
通过使用类组件，你可以在`constructor`里面初始化你的实例(`this`)上面的`state`属性。然而，根据EcmaScript规范，如果你继承一个类，那你必须在使用`this`之前调用`super`。尤其是，当你用React的时候，你还要记住把`props`传递给`super`。

```jsx
  constructor (props) {
    super(props) // ð

    ...
  }
```

### 自动绑定
当使用`createClass`的时候，React魔幻般的帮我们绑定了所有的方法到组件的`this`实例上。但如果用了`React.Component`，就不会是那回事了。很快，全世界的React开发者都意识到自己搞不动`this`关键字的原理。你必须在类的`constructor`方法里面把你的所有方法`bind`一遍，真怀念之前那种稀里糊涂就能正常工作的日子。如果你不这么做，大名鼎鼎的`Cannot read property setState of undefined`错误就会出现。

```jsx
  constructor (props) {
    ...

    this.updateRepos = this.updateRepos.bind(this) // ð
  }
```
当然你可能会想，这些都是小问题，虽然需要调用`super(props)`和`bind`方法让人很烦，但这些都不是原则性的错误。而且，这些其实是JavaScript类的锅。但是，我们是开发者，即便是这些小问题，一天遇到20多次，我们也受不了。幸运的是，我们从`createClass`切换到`React.Component`不久，[Class Fields](https://github.com/tc39/proposal-class-fields)提案被创建了。

### class fields
class fields让你无需使用`constructor`就可以给类添加属性。这对我们来说有啥好处呢？上面两个问题都可以通过这个解决。我们不再需要在`constructor`里面初始化我们的state，也不需要在`constructor`里面`bind`我们的方法，因为我们有了箭头函数大杀器！
```jsx
class ReposGrid extends React.Component {
  state = {
    repos: [],
    loading: true
  }
  componentDidMount () {
    this.updateRepos(this.props.id)
  }
  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.updateRepos(this.props.id)
    }
  }
  updateRepos = (id) => {
    this.setState({ loading: true })

    fetchRepos(id)
      .then((repos) => this.setState({
        repos,
        loading: false
      }))
  }
  render() {
    const { loading, repos } = this.state

    if (loading === true) {
      return <Loading />
    }

    return (
      <ul>
        {repos.map(({ name, handle, stars, url }) => (
          <li key={name}>
            <ul>
              <li><a href={url}>{name}</a></li>
              <li>@{handle}</li>
              <li>{stars} stars</li>
            </ul>
          </li>
        ))}
      </ul>
    )
  }
}
```

感觉很棒！对不对？完美了？其实并没有。有一些影响深远的问题，跟之前那两个问题一样，一直存在，只是大家讨论的不多。

React的核心观点就是你最好通过把你的应用拆成很多小的组件，然后把他们组合在一起，这样来管理你的应用的复杂度。这种组件模型，让React很优雅。问题并不在组件模型，在模型的实现方式上面。

## 重复逻辑

历史上，我们的组件是跟React的生命周期耦合在一起的。这种耦合导致我们把代码分散到组件的各个生命周期函数里面。通过下面的`ReposGrid`例子，我们可以很清晰的看到这点。想要把`props.id`和`repos`保持同步，我们需要三个方法（`componentDidMount`, `componentDidUpdate`和`updateRepos`）。
```jsx
  componentDidMount () {
    this.updateRepos(this.props.id)
  }
  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.updateRepos(this.props.id)
    }
  }
  updateRepos = (id) => {
    this.setState({ loading: true })

    fetchRepos(id)
      .then((repos) => this.setState({
        repos,
        loading: false
      }))
  }
```

想要解决这个问题，我们需要一种全新的处理React组件副作用的范式。

## 共享非UI逻辑
当你思考React的组合的时候，你一般都会考虑UI的组合，因为这就是React所擅长的。
```jsx
view = fn(state)
```
现实中，除了UI层，我们还有很多事情要做。组合和复用非UI逻辑还是很常见的。然而，因为React把UI和组件耦合在一起，所以，这就很难搞，React也没有很好的解决办法。

就拿我们的例子来说，假如我们需要创建另一个也需要`repos`状态的组件。现在，状态和逻辑都在`ReposGrid`组件里面，我们怎么样才能复用呢？最简单的办法就是复制粘贴，很诱人对不对？但是复制粘贴是最不好的办法，另一种好一点的办法就是用[高阶组件](https://tylermcginnis.com/react-higher-order-components/)来把相关的逻辑封装起来，然后把相关的state作为`props`传给需要用它的组件。

```jsx
function withRepos (Component) {
  return class WithRepos extends React.Component {
    state = {
      repos: [],
      loading: true
    }
    componentDidMount () {
      this.updateRepos(this.props.id)
    }
    componentDidUpdate (prevProps) {
      if (prevProps.id !== this.props.id) {
        this.updateRepos(this.props.id)
      }
    }
    updateRepos = (id) => {
      this.setState({ loading: true })

      fetchRepos(id)
        .then((repos) => this.setState({
          repos,
          loading: false
        }))
    }
    render () {
      return (
        <Component
          {...this.props}
          {...this.state}
        />
      )
    }
  }
}
```
现在，任何需要用到`repos`(或者`loading`)的组件，我们都可以用`withRepos`来封装他。
```jsx
// ReposGrid.js
function ReposGrid ({ loading, repos }) {
  ...
}

export default withRepos(ReposGrid)
```

```jsx
// Profile.js
function Profile ({ loading, repos }) {
  ...
}

export default withRepos(Profile)
```
这个的确能做到复用非UI逻辑，而且和[Render Props](https://tylermcginnis.com/react-render-props/)一起被作为推荐方案。但是他们也有缺陷。

首先，这增加了理解代码的心智负担。通过我们的`withRepo`高阶组件，我们有了一个函数，这个函数以我们最终渲染的组件作为参数，但是返回了一个新的类组件，在类组件里面就是我们要复用的代码。真是一个复杂难懂的过程。

其次，我们有多个高阶组件怎么办？正如你想象的那样，很快就失控了
```jsx
export default withHover(
  withTheme(
    withAuth(
      withRepos(Profile)
    )
  )
)
```

比上面更糟糕的就是渲染出来的结果，高阶组件强制你重新组织你的代码，这最终会导致封装地狱。
```jsx
<WithHover>
  <WithTheme hovering={false}>
    <WithAuth hovering={false} theme='dark'>
      <WithRepos hovering={false} theme='dark' authed={true}>
        <Profile 
          id='JavaScript'
          loading={true} 
          repos={[]}
          authed={true}
          theme='dark'
          hovering={false}
        />
      </WithRepos>
    </WithAuth>
  <WithTheme>
</WithHover>
```

## 现状
这就是我们目前的状况：
* React相当流行
* 我们使用类组件，因为这在当时就是最合适的
* 调用`super(props)`很烦人
* 没人知道`this`的原理
* 好，冷静，我知道你知道`this`的原理，但是这真的是不必要的麻烦
* React没有很好用的复用非UI逻辑的模式

我们需要新的组件API来解决上述问题，而且它要简单、灵活、可组合而且可扩展。真难搞，但是React团队竟然搞定了！

## React Hooks
从React v0.14.0开始，我们有两种创建组件的方式，函数组件和类组件。他们之间的区别就是，如果我们需要用状态，或者需要用组件的生命周期函数，那我们就只能用类组件。否则，我们可以用函数组件。

那我们能不能站着，把钱挣了，能不能只用函数组件？
>有时候，优雅的解决方案就是一个函数，不是一个方法，不是一个类，更不是一个框架，就是一个函数
- 约翰·卡马克 Oculus VR CTO

当然我们需要找到让函数组件拥有状态和生命周期函数的方法。假设我们已经找到了，那能给我们带来什么好处呢？

首先我们不用调用`super(props)`了，也不用`bind`我们的方法了，也不用使用Class Fields了，而且前面我们讨论的所有问题统统都没有了。
```jsx
(ノಥ,_｣ಥ)ノ彡 React.Component ð

function ヾ(Ő‿Ő✿)
```

重点来了
* 状态
* 生命周期函数
* 复用非UI逻辑

## 状态
既然我们不用类组件，那我们就需要一种新的方式来添加和管理我们的状态。在React v16.8.0中，React给我们带来了`useState`。
>`useState`是这个课程中众多钩子中的第一个，随着课程的继续，我们会更加深入的研究`useState`。

`useState`只接受一个参数，就是初始状态。返回值是两个值，第一个是状态的值，第二个是修改状态的函数。

```jsx
const loadingTuple = React.useState(true)
const loading = loadingTuple[0]
const setLoading = loadingTuple[1]

...

loading // true
setLoading(false)
loading // false
```

正如你看到的那样，从数组里面一个一个的取值是相当不舒服的姿势，这仅仅是为了说明`useState`的返回值是一个数组。通常情况下我们都会用数组的解构赋值来在一行里面取值
```jsx
// const loadingTuple = React.useState(true)
// const loading = loadingTuple[0]
// const setLoading = loadingTuple[1]

const [ loading, setLoading ] = React.useState(true) // 👌
```
现在让我们用我们新找到的`useState`钩子来更新我们的`ReposGrid`组件
```jsx
function ReposGrid ({ id }) {
  const [ repos, setRepos ] = React.useState([])
  const [ loading, setLoading ] = React.useState(true)

  if (loading === true) {
    return <Loading />
  }

  return (
    <ul>
      {repos.map(({ name, handle, stars, url }) => (
        <li key={name}>
          <ul>
            <li><a href={url}>{name}</a></li>
            <li>@{handle}</li>
            <li>{stars} stars</li>
          </ul>
        </li>
      ))}
    </ul>
  )
}
```

* 状态 ✔
* 生命周期函数
* 共享非UI逻辑

## 生命周期函数
这里可能会让你有些忧伤(或者高兴？)，你必须忘记所有传统React生命周期函数。我们已经见识到了用生命周期函数的方式所带来的问题。“这种[生命周期函数]导致我们把代码分散到组件的各个组件里面”，这次，我们以**同步**的方式来思考。
任何我们考虑生命周期事件的时候，我们就考虑怎么用同步。不论它是设置初始状态、获取数据、更新DOM还是别的任何事。具体来说就是，从React外面(服务器，DOM，等)到React里面(状态)，反过来也一样。
当你以同步，而不是生命周期事件来思考的时候，我们可以把相关的逻辑组合到一起。我们可以用React的`useEffect`来达到这一目的。
正如名字一样，`useEffect`让我们可以在函数组件里面产生副作用，它接受两个参数，一个函数和一个可选的数组。函数定义了如何产生副作用，而(可选)数组定义了何时“重新同步”(或者重跑)副作用。
```jsx
React.useEffect(() => {
  document.title = `Hello, ${username}`
}, [username])
```
在上面的代码中，只要username变化，函数就会被执行。因此就达到了使文档标题和`Hello, ${username}`保持同步的效果。

现在，我们怎么样才能在我们的代码里面用`useEffect`钩子来保持`repos`和我们的`fetchRepos`API请求同步？

```jsx
function ReposGrid ({ id }) {
  const [ repos, setRepos ] = React.useState([])
  const [ loading, setLoading ] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)

    fetchRepos(id)
      .then((repos) => {
        setRepos(repos)
        setLoading(false)
      })
  }, [id])

  if (loading === true) {
    return <Loading />
  }

  return (
    <ul>
      {repos.map(({ name, handle, stars, url }) => (
        <li key={name}>
          <ul>
            <li><a href={url}>{name}</a></li>
            <li>@{handle}</li>
            <li>{stars} stars</li>
          </ul>
        </li>
      ))}
    </ul>
  )
}
```

相当花哨，对不对？我们成功的摆脱了`React.Component`，`constructor`，`super`和`this`，而且最重要的是我们的副作用逻辑不会重复出现在组件中。

* state ✔
* 生命周期函数 ✔
* 共享非UI逻辑

### 共享非UI逻辑
之前我们提到React没法共享非UI逻辑的原因是“React的组件和UI耦合在一起”。这导致过于复杂的模式，比如高阶组件或者[Render props](https://tylermcginnis.com/react-render-props/)。就像你猜的那样，Hooks能解决这些。然而，可能跟你想的不一样，没有内置的Hook来共享非UI逻辑，你得创建你自己的Hooks来从UI解耦。

我们可以通过创建我们自己的`useRepos`Hook来看一下，这个Hook接收一个Repos的`id`，返回一个数组，数组的第一个元素就是`loading`状态，第二个元素就是`repos`状态。

```jsx
function useRepos (id) {
  const [ repos, setRepos ] = React.useState([])
  const [ loading, setLoading ] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)

    fetchRepos(id)
      .then((repos) => {
        setRepos(repos)
        setLoading(false)
      })
  }, [id])

  return [ loading, repos ]
}
```
这里最棒的就是任何与获取我们的`repos`有关的逻辑都可以被抽取到这个自定义的Hook中。现在，无论我们现在在哪个组件中，甚至是非UI逻辑，任何时候我们需要与`repos`有关的数据，我们就可以使用我们的`useRepos`自定义Hook。
```jsx
function ReposGrid ({ id }) {
  const [ loading, repos ] = useRepos(id)

  ...
}
```jsx
function Profile ({ user }) {
  const [ loading, repos ] = useRepos(user.id)

  ...
}
```

* state ✔
* 生命周期函数 ✔
* 共享非UI逻辑 ✔

Hooks的卖点就是让函数组件内部可以有状态，实际上，Hooks能做个的事情比这个更多。更好的代码重用，组合，更好的默认值。关于Hooks我们需要学的还有更多，但是现在你知道了**为什么**我们会存在，我们有了一个坚实的基础。
