## Android

### Activity

#### 生命周期

![](Images\Activity 生命周期.png)

![](Images\Activity 生命周期 (增加 ViewModel).png)

```
onCreate(Bundle?)
实例化部件并将它们放置在屏幕上(setContentView(Int))；
引⽤已实例化的部件；
为部件设置监听器以处理⽤户交互；
访问外部模型数据。

主屏幕键
onPause() -> onStop() (在内存中，但不可见，不会活动在前台)

最近应⽤键
onStart() -> onResume()

回退键
onPause() -> onStop() -> onDestroy() 不在内存⾥，不可见

多窗⼜模式下，不管⽤户和哪⼀个窗⼜应⽤交互，所有完全可见的activity都将处于运⾏状
态。
implementation "androidx.lifecycle:lifecycle-extensions:2.2.0"

Activity 何时被销毁有两种情况： ⼀是⽤户结束使⽤activity， ⼆是因设备配置改变时的系统销毁
ViewModel把UI状态保存在内存⾥，以应对设备配置的改变。
ViewModel的⽣命周期更符合⽤户的预期：设备配置发⽣变化数据也
不会丢失，只有在关联activity结束使命时才会与之⼀起销毁。
UI状态数据保存在ViewModel⾥不会像activity那样因设备配置改变被销毁⽽丢失数据。

设备旋转时， ViewModel实例留在了内存⾥， ⽽原始activity实例已经被销毁。如果某个ViewModel强引⽤着原始activity实例，则会带来两个问题： ⾸先，原始activity实例⽆法从内存⾥清除，因⽽它泄漏了；其次，该ViewModel引⽤的是⼀个失效activity。因此，如果它想更新失效activity的视图，则会抛出IllegalStateException异常

操作系统做起销毁的事毫不留情，不会去调⽤任何activity或ViewModel的⽣命周期回调函数。

在未结束使⽤的activity进⼊停⽌状态时（⽐如⽤户按了Home按钮，启动另⼀个应⽤时），操作系统都会调⽤
Activity.onSaveInstanceState(Bundle)


activity进⼊暂存状态并不⼀定需要调⽤onDestroy()函数。
不过， onStop()和onSaveInstanceState(Bundle)是两个可靠
的函数（除⾮设备出现重⼤故障）。因⽽，常见的做法是，覆盖
onSaveInstanceState(Bundle)函数，在Bundle对象中，保存
当前activity⼩的或暂存状态的数据；覆盖onStop()函数，保存永久性数据， ⽐如⽤户编辑的⽂字等。调⽤完onStop()函数后， activity
随时会被系统销毁，所以⽤它保存永久性数据。


onPause 和onStop都不能执行耗时的操作，尤其是onPause，这也意味着，我们应当尽量在onStop中做操作，从而使得新 Activity 尽快显示出来并切换到前台。


情况 1:设备配置改变导致 Activity 被杀死并重新创建
系统只在Activity异常终止的时候才会调用 onSavelnstanceState 和 onRestoreInstanceState 来存储和恢复数据,其他情况不会触发这个过程。
情况 2:资源内存不足导致低优先级的 Activity 被杀死
```

> 设备配置改变: 应⽤屏旋转、窗口⼤⼩调整 、夜间模式切换  

#### 启动模式

```markdown
android:launchMode: standard、singleTop、singleTask、singleInstance
```



###  Intent

```markdown
Intent: 在 App 组件之间传递消息或启动某种操作的机制。
它是 App 中进行交互和通信的重要组成部分。
可以在不同部分中间(ex. Activity、Service 和 Broadcast Reveiver) 传递信息，和启动系统组件
```



#### 显式 Intent

![](Images\Activity 互操作.png)

```kotlin
cheatButton.setOnClickListener {
    // Start CheatActivity
    val intent = Intent(this, CheatActivity::class.java)
    val answerIsTrue = quizViewModel.currentQuestionAnswer
    val intent = CheatActivity.newIntent(this@MainActivity,answerIsTrue)
    startActivity(intent)
}

startActivityForResult(intent, REQUEST_CODE_CHEAT)

override fun onActivityResult(requestCode: Int,  resultCode: Int,  data: Intent? ) {
    super.onActivityResult(requestCode, resultCode, data)
    if (resultCode != Activity.RESULT_OK) return
    if (requestCode == REQUEST_CODE_CHEAT) {
        quizViewModel.isCheater = data?.getBooleanExtra(EXTRA_ANSWER_SHOWN, false) ?: false
    }
}

val apply = Intent().apply {
	putExtra(EXTRA_ANSWER_SHOWN, mCheat)
}
setResult(Activity.RESULT_OK, apply)
```

#### 隐式 Intent

```markdown
action  要求 Intent 中必须有一个 action 且必须能够和过滤规则中的某个 action 相同，
category要求 Intent 可以没有 category，但是如果你一旦有 category，不管有几个，每个都要能够和过滤规则中的任何一个 category相同。
```



1. Action
定义: action 是一个字符串，用于指定要执行的动作。常见的动作包括：
ACTION_VIEW: 显示某个数据（如网页、图片等）。
ACTION_EDIT: 编辑某个数据。
ACTION_SEND: 发送数据（如分享文本或图片）。
用途: action 指明了你希望 Intent 执行的具体操作。例如，当你想要打开一个网页时，可以使用 ACTION_VIEW 作为 action。

2. Category
定义: category 是一个字符串，用于提供有关 Intent 的额外信息。它通常用于限制接收 Intent 的组件类型。常见的类别包括：
CATEGORY_DEFAULT: 默认类别，表示这个 Intent 可以被普通的应用组件处理。
CATEGORY_BROWSABLE: 允许用户浏览内容。
CATEGORY_LAUNCHER: 允许该活动在应用程序启动器中显示。
用途: category 使得 Intent 更加具体，帮助系统确定哪些应用组件可以处理这个 Intent。例如，如果一个活动声明了 CATEGORY_LAUNCHER，那么它可以作为应用程序的启动入口。

```xml
 <uses-permission android:name="android.permission.READ_CONTACTS" />

<queries>
    <!-- 获取拍照的图片 -->
    <intent>
        <action android:name="android.media.action.IMAGE_CAPTURE" />
    </intent>
    <!-- 读取联系人 -->
    <intent>
        <action android:name="android.intent.action.PICK" />
        <data
              android:host="com.android.contacts"
              android:mimeType="*/*"
              android:scheme="content" />
    </intent>
</queries>
```

```kotlin
private val mContactResultLauncher: ActivityResultLauncher<Intent> =
registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {
    handleContactResult(it)
}

mBinding.crimeSuspect.apply {
    val pickIntent = Intent(Intent.ACTION_PICK, ContactsContract.Contacts.CONTENT_URI)
    setOnClickListener {
        mContactResultLauncher.launch(pickIntent)
    }
    val resolveActivity: ResolveInfo? = requireActivity().packageManager
    .resolveActivity(pickIntent, PackageManager.MATCH_DEFAULT_ONLY)
    if (resolveActivity == null) {
        isEnabled = false
    }
}
```


```kotlin
// 通过 Intent(ACTION_MAIN) 和 CATEGORY_LAUNCHER 查询设备上所有能够作为启动界面的应用。
val startupIntent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
}
val activities =
packageManager.queryIntentActivities(startupIntent, PackageManager.MATCH_ALL)
activities.sortWith(Comparator { a, b ->
                                String.CASE_INSENSITIVE_ORDER.compare(
                                    a.loadLabel(packageManager).toString(),
                                    b.loadLabel(packageManager).toString()
                                )
})

// 启动点击的应用
 override fun onClick(v: View) {
     val activityInfo = mResolveInfo.activityInfo
     val intent = Intent(Intent.ACTION_MAIN).apply {
         setClassName(
             activityInfo.applicationInfo.packageName,
             activityInfo.name
         )
         addFlags(Intent.FLAG_ACTIVITY_NEW_TASK) // 在新的任务栈中启动目标 Activity
     }
     v.context.startActivity(intent)
 }
```

#### Broadcast intent

> 有序 Broadcast 

```kotlin
// 广播消息
private fun showBackgroundNotification(requestCode: Int, notification: Notification) {
    val intent = Intent(ACTION_SHOW_SHOW_NOTIFICATION).apply {
        putExtra(REQUEST_CODE, requestCode)
        putExtra(NOTIFICATION, notification)
    }
    //发送带权限限制的有序广播：只有声明并获取权限的广播接收者可以接受到
    mContext.sendOrderedBroadcast(intent, PERMISSION_PRIVATE)
}
```

> 静态注册广播

（静态注册为让程序在未启动情况下也能接收到广播）


```kotlin
// standalone broadcast receiver
// 在 manifest 配置文件中声明的 broadcast receiver，即便应用进程已消亡， standalone receiver 也可以被激活。
class NotificationReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "onReceive: receive  result = $resultCode")
        if (resultCode != Activity.RESULT_OK) {
            // A foreground activity canceled the broadcast
            return
        }
        val requestCode = intent.getIntExtra(PollWorker.REQUEST_CODE, 0)
        val notification: Notification? =
            intent.getParcelableExtra(PollWorker.NOTIFICATION)
        val notificationManager = NotificationManagerCompat.from(context)
        notificationManager.notify(requestCode, notification ?: return)
    }
}
```

```xml
<!--    创建私有权限-->
<permission
            android:name="${applicationId}.PRIVATE"
            android:protectionLevel="signature" />

<!--  登记 NotificationReceiver 为 standalone receiver  -->
<receiver
          android:name=".NotificationReceiver"
          android:exported="false"
          android:permission="${applicationId}.PRIVATE">
    <!-- 最低的优先级，-999，而-1000是系统保留的值 -->
    <intent-filter android:priority="-999">
        <action android:name="${applicationId}.SHOW_NOTIFICATION" />
    </intent-filter>
</receiver>
```

> 动态注册广播

```kotlin
abstract class VisibleFragment : Fragment() {
    private val mReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent) {
            Toast.makeText(
                requireContext(),
                "Got a broadcast: ${intent.action}",
                Toast.LENGTH_LONG
            ).show()
            //有序广播
            //修改Intent中的数据。同时也可以修改 resultData（setResult(Int, String?, Bundle?)）
            //  或者 setResultExtras
            //默认情况下，发送成功 resultCode 会设置为 Activity.RESULT_OK,然后继续发送给下一个
            //resultCode 设置为Activity.RESULT_CANCELED 之后，后面的接收者则无法接收到该广播
            resultCode = Activity.RESULT_CANCELED
        }
    }
}
```



### Fragment 

![](Images\Fragment Layout.png)

![](Images\Fragment MVC.png)

 ```
托管UI fragment， activity必须：
	在其布局中为fragment的视图安排位置；
	管理fragment实例的⽣命周期。

fragment事务被⽤来添加、移除、附加、分离或替换fragment队列中的fragment。
 ```

```kotlin
val currentFragment = supportFragmentManager.findFragmentById(R.id.fragment_containe
r)

if (currentFragment == null) {
	val fragment = CrimeFragment()
    supportFragmentManager.beginTransaction().add(R.id.fragment_container, fragment)
    .commit()
}


class MainActivity : AppCompatActivity(), CrimeListFragment.Callbacks {
...
override fun onCrimeSelected(crimeId: UUID) {
    val fragment = CrimeFragment()
    supportFragmentManager
    .beginTransaction()
    .replace(R.id.fragment_container, fragment)
    .addToBackStack(null)
    .commit()
    }
}
```

#### 生命周期

#### Navigation  

```kotlin


1.通过托管 activity 响应⽤户操作交换显⽰不同的fragment，以实现⽤户界⾯导航

2.使⽤ fragment argument 把数据传递给fragment实例
companion object {
    fun newInstance(crimeId: UUID): CrimeFragment {
        val args = Bundle().apply {
            putSerializable(ARG_CRIME_ID, crimeId)
        }
        return CrimeFragment().apply {
            arguments = args
        }
    }
}

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    crime = Crime()
    val crimeId: UUID = arguments?.getSerializable(ARG_CRIME_ID) as UUID
    crimeDetailViewModel.loadCrime(crimeId)
}


3.使⽤LiveData transformation响应UI状态变化加载不可变数据
```

| 方法                          | 描述                                                         | 适用场景                         |
| :---------------------------- | :----------------------------------------------------------- | :------------------------------- |
| **默认行为**                  | `Fragment` 会被销毁并重建，数据丢失。                        | 无特殊需求的场景。               |
| **`onSaveInstanceState`**     | 保存临时数据，在重建时恢复。                                 | 需要保存简单 UI 状态的场景。     |
| **`configChanges`**           | 避免 `Activity` 和 `Fragment` 销毁重建，需手动处理配置变化。 | 需要完全控制配置变化的场景。     |
| **`setRetainInstance(true)`** | 保留 `Fragment` 实例，但视图会被销毁重建。                   | 需要保留 `Fragment` 实例的场景。 |
| **`ViewModel`**               | 数据不会因屏幕旋转而丢失，生命周期更长。                     | 需要持久化数据的场景。           |

- 默认情况下，旋转屏幕会导致 `Fragment` 销毁重建。
- 通过 `onSaveInstanceState`、`setRetainInstance` 或 `ViewModel` 可以避免数据丢失。
- 使用 `ViewModel` 是最推荐的方式，因为它符合现代 Android 开发的最佳实践。

#### Argument  

```kotlin
// 传递数据给 DatePickerFragment
class CrimeFragment : Fragment() {
	override fun onStart() {
		dateButton.setOnClickListener {
			DatePickerFragment.newInstance(crime.date).apply {
				setTargetFragment(this@CrimeFragment, REQUEST_DATE)
				show(this@CrimeFragment.requireFragmentManager(), DIALOG_DATE)
			}
		}
	}
}

// 返回数据给CrimeFragment
override fun onDateSelected(date: Date) {
	crime.date = date
	updateUI()
}


```

### ViewPager

### ViewPager2

```markdown
实现引导页或欢迎页：ViewPager2可以用于创建引导页或欢迎页，让用户通过滑动浏览介绍应用程序功能或展示欢迎内容。

创建图片浏览器：ViewPager2可以用于创建图片浏览器，允许用户通过滑动来切换不同的图片，并支持缩放和手势交互。

构建轮播图：ViewPager2非常适合构建轮播图功能，可以通过适配器动态加载不同的轮播项，并提供自动循环滚动的功能。

实现选项卡式布局：结合TabLayout，ViewPager2可以用于创建选项卡式布局，让用户通过滑动选项卡来切换不同的内容页面。

创建垂直滑动页面：与ViewPager不同，ViewPager2支持垂直方向的滑动，因此可以用于创建垂直滑动的页面布局，例如垂直滑动的导航菜单或垂直的新闻列表。

实现分页数据展示：ViewPager2可以用于展示分页数据，例如将大量数据按页加载并在每一页中展示一部分内容。

嵌套滑动布局：ViewPager2可以与其他滑动组件（如RecyclerView）嵌套使用，实现复杂的滑动布局结构。

实现自定义的滑动效果：通过使用自定义的转换器（Transformer），可以实现各种炫酷的页面切换效果，例如渐变、缩放、旋转等
```



### RecyclerView  

![](Images\RecyclerView+Adapter+ViewHolder.png)

```kotlin
override fun onCreateView(inflater: LayoutInflater,container: ViewGroup?,savedInstanceState: Bundle?
): View? {
    val view = inflater.inflate(R.layout.fragment_crime_list, container, false)
    crimeRecyclerView = view.findViewById(R.id.crime_recycler_view) as RecyclerView
    crimeRecyclerView.layoutManager = LinearLayoutManager(context)
    // 添加分割线
    crimeRecyclerView.addItemDecoration(DividerItemDecoration(this, DividerItemDecoration.VERTICAL))
    // updateUI()
    return view
}
```





#### Adapter

```kotlin
private fun updateUI() {
    val crimes = crimeListViewModel.crimes
    adapter = CrimeAdapter(crimes)
    crimeRecyclerView.adapter = adapter
}

private inner class CrimeAdapter(var crimes: List<Crime>) :RecyclerView.Adapter<CrimeHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int)
    : CrimeHolder {
        val view = layoutInflater.inflate(R.layout.list_item_crime, parent, false)
        return CrimeHolder(view)
    }
    override fun onBindViewHolder(holder: CrimeHolder, position: Int) {
        val crime = crimes[position]
        holder.bind(crime)
    }
    override fun getItemCount() = crimes.size
}
```



#### ViewHolder

```kotlin
private inner class CrimeHolder(view: View) : RecyclerView.ViewHolder(view),
View.OnClickListener {
    private lateinit var crime: Crime
    private val titleTextView: TextView = itemView.findViewById(R.id.crime_title)
    private val dateTextView: TextView = itemView.findViewById(R.id.crime_date)

    init {
        itemView.setOnClickListener(this)
    }

    fun bind(crime: Crime) {
        this.crime = crime
        titleTextView.text = this.crime.title
        dateTextView.text = this.crime.date.toString()
    }

    override fun onClick(v: View) {
        Toast.makeText(context, "${crime.title} clicked!", Toast.LENGTH_SHORT)
        .show()
    }
}
```



```
⾸先， RecyclerView会调⽤Adapter的onCreateViewHolder(ViewGroup, Int)函数创建ViewHolder及其要显⽰的视图。此时， Adapter创建并返给RecyclerView的ViewHolder（和它的itemView）还没有数据。

然后， RecyclerView会调⽤onBindViewHolder(ViewHolder,Int)函数，传⼊ViewHolder和Crime对象的位置。 Adapter会找到⽬标位置的数据并将其绑定到ViewHolder的视图上。所谓绑定，就是使⽤模型对象数据填充视图。

整个过程执⾏完毕， RecyclerView就能在屏幕上显⽰crime列表项
了
```

```
Adapter负责：
    创建必要的ViewHolder；
    绑定ViewHolder⾄模型层数据。
    
RecyclerView负责：
    请Adapter创建ViewHolder；
    请Adapter绑定ViewHolder⾄具体的模型层数据。
```



#### LayoutManager

```
LinearLayoutManager
GridLayoutManager
StaggeredGridLayoutManager
```



### SmartRefreshLayout

https://juejin.cn/post/6844903486409310222

+ RefreshLayout 下拉的基本功能，包括布局测量、滑动事件处理、参数设定等等
+ RefreshContent 对不同内容的统一封装，包括判断是否可滚动、回弹判断、智能识别
+ RefreshHeader 下拉头部的实现和显示
+  RefreshFooter 上拉底部的实现和显示

```
变换方式
    Translate 平行移动 特点: 最常见，HeaderView高度不会改变，
    Scale 拉伸形变 特点：在下拉和上弹（HeaderView高度改变）时候，会自动触发OnDraw事件
    FixedFront 固定在前面 特点：不会上下移动，HeaderView高度不会改变
    FixedBehind 固定在后面 特点：不会上下移动，HeaderView高度不会改变（类似微信浏览器效果）
    Screen 全屏幕 特点：固定在前面，尺寸充满整个布局

```



### LiveData

```kotlin
private val mCrimeIdLiveData = MutableLiveData<UUID>()

var mCrimeLiveData: LiveData<Crime?> =
        Transformations.switchMap(mCrimeIdLiveData) { crimeId ->
            mCrimeRepository.getCrime(crimeId)
        }

mCrimeDetailViewModel.mCrimeLiveData
.observe(viewLifecycleOwner) { crime ->
                              crime?.let {
                                  this.mCrime = it
                                  mPhotoFile = mCrimeDetailViewModel.getPhotoFile(it)
                                  mPhotoUri = getUriCompat(mPhotoFile)
                                  updateUI()
                              }
                             }
```



```kotlin
class PhotoGalleryViewModel(application: Application) : AndroidViewModel(application) {
    val mGalleryItemLiveData: LiveData<List<GalleryItem>>
    private val mMutableLiveDataSearchTerm: MutableLiveData<String> = MutableLiveData()

    val mSearchTerm: String
        get() = mMutableLiveDataSearchTerm.value ?: ""

    init {
        mMutableLiveDataSearchTerm.value = QueryPreferences.getStoredQuery(getApplication())
        mGalleryItemLiveData = Transformations.switchMap(mMutableLiveDataSearchTerm) { searchTerm ->
            ...
        }
}
    
class PhotoGalleryNavFragment : BaseVisibleFragment() {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        mPhotoGalleryViewModel.mGalleryItemLiveData
        .observe(viewLifecycleOwner) 
        { galleryItems -> mPhotoAdapter.submitList(galleryItems) }
    }    
}
```



### Thread

```java
 runOnUiThread(() -> contentTv.setText(e.getMessage()));

new Thread(() -> {
	try {
		URL url = new URL(videoEntity.getPlayurl());
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		connection.setRequestMethod("GET");
		connection.connect();

		int responseCode = connection.getResponseCode();
		boolean success = responseCode == HttpURLConnection.HTTP_OK;

		// 使用 Handler 将结果传递回主线程
		new Handler(Looper.getMainLooper()).post(() -> {
			if (success) {
				// 网络请求成功，更新 UI
			} else {
				// 网络请求失败，提示用户
			}
		});
	} catch (Exception e) {
		e.printStackTrace();
	}
}).start();
```

#### Looper

![](Images\Looper.png)

```java
Looper.prepare()
...
Looper.loop()
// 之后的代码不会立即执行
// 因为当前线程会进入一个无限循环，用于处理消息队列中的消息，直到显式地退出循环或终止线程
```



#### Handler

```java
// 主线程是⼀个拥有 handler 和 Looper 的消息循环
// 主线程上创建的 Handler 会⾃动 与它的 Looper 相关联
// 主线程上创建的 Handler 也可以传递给另⼀线程。
// 传递出去的 Handler 与 主线程 Looper 始终保持着联系，
// 因此，这个 Handler 负责处理的所有消息都将在主线程的消息队列中处理，进而能安全地访问和更新 UI 元素
public class MainActivity extends AppCompatActivity {
    private Handler handler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(Message msg) {
            // 更新 UI
            TextView textView = findViewById(R.id.textView);
            textView.setText("Result: " + msg.obj);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        new Thread(new Runnable() {
            @Override
            public void run() {
                // 模拟耗时任务
                String result = longRunningTask();

                // 发送结果到主线程
                Message message = handler.obtainMessage(1, result);
                handler.sendMessage(message);
            }

            private String longRunningTask() {
                // 模拟长时间运行的任务，比如网络请求
                try {
                    Thread.sleep(3000); // 睡眠3秒
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                return "Task completed";
            }
        }).start();
    }
}
```



#### HandlerThread

```java
// 主线程中创建的 Handler -- mainHandler
// HandlerThead 中创建的 Handler -- workerHandler
public class MainActivity extends AppCompatActivity {
    private MyWorkerThread myWorkerThread;
    private Handler mainHandler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 创建主线程 Handler
        mainHandler = new Handler(Looper.getMainLooper());

        // 创建并启动 HandlerThread
        myWorkerThread = new MyWorkerThread("MyWorkerThread");
        myWorkerThread.start();

        // 获取 Handler
        Handler workerHandler = myWorkerThread.getHandler();

        // 发送消息到 Handler
        for (int i = 0; i < 5; i++) {
            Message message = workerHandler.obtainMessage(i);
            workerHandler.sendMessage(message);
        }
    }

    // 在 MyWorkerThread 中使用
    class MyWorkerThread extends HandlerThread {
        private Handler workerHandler;

        public MyWorkerThread(String name) {
            super(name);
        }

        @Override
        protected void onLooperPrepared() {
            workerHandler = new Handler(getLooper()) {
                @Override
                public void handleMessage(Message msg) {
                    // 处理耗时操作
                    Log.d("WorkerThread", "Processing message: " + msg.what);
                    try {
                        Thread.sleep(2000); // 模拟耗时操作
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }

                    // 模拟结果
                    final String result = "Result from message: " + msg.what;

                    // 在主线程中更新 UI
                    mainHandler.post(new Runnable() {
                        @Override
                        public void run() {
                            TextView textView = findViewById(R.id.textView);
                            textView.setText(result);
                        }
                    });
                }
            };
        }

        public Handler getHandler() {
            return workerHandler;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // 停止 HandlerThread
        myWorkerThread.quitSafely();
    }
}
```



![](Images\HandlerThread.png)

```kotlin
val responseHandler = Handler(Looper.getMainLooper())
mThumbnailDownloader = ThumbnailDownloader(responseHandler) { holder, bitmap ->
	val drawable = BitmapDrawable(resources, bitmap)
	holder.bindDrawable(drawable)
}
lifecycle.addObserver(mThumbnailDownloader.fragmentLifecycleObserver)

thumbnailDownloader.queueThumbnail(holder, galleryItem.url)

lifecycle.removeObserver(mThumbnailDownloader.fragmentLifecycleObserver)
```

```kotlin
class ThumbnailDownloader<in T>(
    private val mResponseHandler: Handler,
    //private val mLifecycle: Lifecycle,
    private val onThumbnailDownloaded: (T, Bitmap) -> Unit
) : HandlerThread(TAG) {
    private var mHasQuit = false
    private lateinit var mRequestHandler: Handler
    private val mRequestMap: ConcurrentHashMap<T, String> = ConcurrentHashMap()
    private val mFlickrFetchr = FlickrFetchr()


    private val mCache: LruCache<String, Bitmap>

    init {
        //mLifecycle.addObserver(fragmentLifecycleObserver)
        val cacheSize = Runtime.getRuntime().maxMemory().div(100).toInt()
        mCache = LruCache(cacheSize)
    }

    @Suppress("UNCHECKED_CAST")
    override fun onLooperPrepared() {
        super.onLooperPrepared()
        mRequestHandler = object : Handler(looper) {
            override fun handleMessage(msg: Message) {
                super.handleMessage(msg)
                if (msg.what == MESSAGE_DOWNLOAD) {
                    val target: T = msg.obj as T ?: return
                    target?.let {
                        Log.i(TAG, "Got a request for URL:${mRequestMap[target]}")
                    }
                    handleRequest(target)
                }
            }
        }
    }

    override fun quit(): Boolean {
        mHasQuit = true
        return super.quit()
    }

    /**
     * 从技术实现来看，创建Handler实现也创建了一个内部类。
     * 内部类天然 持有外部类(这里指ThumbnailDownloader类)的实例引用。
     * 这样一来，如果内部类的生命周期比外部类长，就会出现外部类的内存泄漏问题。
     * 不过，只有在把Handler添加给主线程的looper时才会有此问题。
     * 这里， 使用@SuppressLint("HandlerLeak")的作用是不让Lint报警，
     * 因为此处创 建的Handler是添加给后台线程的looper的。
     * 如果把你创建的Handler添加 给主线程的looper，
     * 那么它就不会被垃圾回收，自然就会内存泄漏，
     * 进 而导致它引用的ThumbnailDownloader实例也引发内存泄漏问题。
     */
    private fun handleRequest(target: T?) {
        target ?: return
        val url = mRequestMap[target] ?: return
        val bitmap = mCache[url] ?: mFlickrFetchr.fetchPhoto(url) ?: return
        mResponseHandler.post(Runnable {
            if (mRequestMap[target] != url || mHasQuit) {
                return@Runnable
            }
            mRequestMap.remove(target)
            onThumbnailDownloaded(target, bitmap)
            mCache.put(url, bitmap)
        })
    }

    fun queueThumbnail(target: T, url: String) {
        Log.i(TAG, "queueThumbnail: $url")
        mRequestMap[target] = url
        mRequestHandler.obtainMessage(MESSAGE_DOWNLOAD, target).sendToTarget()
    }


    val fragmentLifecycleObserver: LifecycleObserver =
        object : DefaultLifecycleObserver {
            /**
             * 当生命周期所有者创建时，回调，通过注解
             */
            override fun onCreate(owner: LifecycleOwner) {
                Log.i(TAG, "setup: Starting background thread")
                start()
                looper
            }

            /**
             * 当生命周期所有者销毁时，回调，通过注解
             */
            override fun onDestroy(owner: LifecycleOwner) {
                Log.i(TAG, "Destroying background thread")
                quit()
                Log.i(TAG, "Clearing all requests from queue")
                mRequestHandler.removeMessages(MESSAGE_DOWNLOAD)
                mRequestMap.clear()
            }

        }

}
```


#### Executor

```java
// 通过 Executor 后台线程中处理任务和获取结果 ，并使用 Handler 更新 UI 
public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private ExecutorService executorService;
    private Handler uiHandler;
    private TextView resultTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 初始化 TextView
        resultTextView = findViewById(R.id.resultTextView);
        
        // 创建 Handler，用于在主线程中更新 UI
        uiHandler = new Handler(Looper.getMainLooper());
        
        // 创建 ExecutorService
        executorService = Executors.newSingleThreadExecutor();

        // 提交可返回结果的任务
        Future<Integer> future = executorService.submit(new Callable<Integer>() {
            @Override
            public Integer call() throws Exception {
                // 模拟耗时操作
                Thread.sleep(2000);
                return 42; // 返回计算结果
            }
        });

        // 使用新线程处理任务，并在完成后更新 UI
        executorService.execute(() -> {
            try {
                // 获取结果，阻塞但在后台线程中
                Integer result = future.get();
                
                // 在 UI 线程更新 UI
                uiHandler.post(() -> {
                    resultTextView.setText("Result from task: " + result);
                });
                
            } catch (InterruptedException | ExecutionException e) {
                Log.e(TAG, "Task failed", e);
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // 关闭 ExecutorService
        executorService.shutdown();
    }
}
```



### WorkManager

```kotlin
private fun togglePolling() {
    val isPolling = QueryPreferences.isPolling(requireContext())
    if (isPolling) {
        Log.d(TAG, "togglePolling: stop polling")
        WorkManager.getInstance().cancelAllWorkByTag(POLL_WORK)
    } else {
        Log.d(TAG, "togglePolling: start polling")
        //设置work启动的条件
        //NetworkType.NOT_REQUIRED:不需要网络
        //NetworkType.CONNECTED:任何已连接的网络
        //NetworkType.UNMETERED:不限制流量的网络，包括WIFI和以太网
        //NetworkType.NOT_ROAMING:非漫游的网络
        //NetworkType.METERED:按流量计费的网络，移动网络
        val constraints = Constraints.Builder()
        .setRequiredNetworkType(NetworkType.CONNECTED)
        .build()

        //OneTimeWorkRequest:执行一次性任务
        //PeriodicWorkRequest:定期执行任务
        val periodRequest = PeriodicWorkRequest
        //每十五分钟执行一次:
        // todo 15分钟 这也是最短的时间间隔，防止系统过于频繁地执行同一任务，从而节约资源，如电池
        .Builder(PollWorker::class.java, 15, TimeUnit.MINUTES)
        //增加网络类型限制
        .setConstraints(constraints)
        .build()
        WorkManager.getInstance()
        // TODO: 2021/7/17 各个参数的含义
        //  名称；当前的服务策略；网络服务请求(要做的事情)
        //  名称参数：唯一性，标识网络请求，停止服务时引用
        //  当前服务策略告诉WorkManager该如何对待已计划安排好的具名工作任务。
        //  这里使用的是KEEP策略，意思是保留当前服务，不接受安排新的后台服务。
        //  当前服务策略的另一个选择是REPLACE，顾名思义，就是使用新的后台服务替换当前服务。
        .enqueueUniquePeriodicWork(
            POLL_WORK,
            ExistingPeriodicWorkPolicy.KEEP,
            periodRequest
        )
    }
    //set newValue
    QueryPreferences.setPolling(requireContext(), !isPolling)
}
```



```kotlin
class PollWorker(private val mContext: Context, workerParameters: WorkerParameters) :
    Worker(mContext, workerParameters) {

    /**
     * 轮询
     * 运行在后台线程
     * 返回三种结果：
     * [androidx.work.ListenableWorker.Result.Failure] 失败：任务不再运行
     * [androidx.work.ListenableWorker.Result.Retry] 重试：出现问题，可以再次运行
     * [androidx.work.ListenableWorker.Result.Success] 成功：任务成功
     * TODO 原文 "doWork()会在后台线程上调用，你不能安排它做任何耗时任务"？？
     *  -->"doWork()会在后台线程上调用，你不能安排它做任何 UI 操作"
     */
    override fun doWork(): Result {
        //Work request triggered:工作请求已触发
        Log.i(TAG, "Work request triggered")
        val storedQuery = QueryPreferences.getStoredQuery(mContext)
        val lastResultId = QueryPreferences.getLastResultId(mContext)

        val item: List<GalleryItem> = if (storedQuery.isEmpty()) {
            FlickrFetchr().fetchPhotoRequest()
                .execute()
                .body()?.galleryItems
        } else {
            FlickrFetchr().searchPhotosRequest(storedQuery)
                .execute()
                .body()?.galleryItems
        } ?: emptyList()

        if (item.isEmpty()) {
            return Result.success()
        }
        val resultId = item.first().id
        if (resultId == lastResultId) {
            Log.i(TAG, "Got an old result: $resultId")
        } else {
            //更新新的ID
            Log.i(TAG, "Got a new result: $resultId")
            QueryPreferences.setLastResultId(mContext, resultId)
            showNotification()
        }

        return Result.success()
    }
}
```







### Layout

```
match_parent: 视图占据父视图的全部可用空间。
wrap_content: 视图的大小根据其内容自动调整。

 match_parent -> MeasureSpec.EXACTLY。
 wrap_content-> MeasureSpec.AT_MOST。
 具体值 -> MeasureSpec.EXACTLY。

android:orientation
```

在 Android 开发中，布局容器（Layout Container）用于定义用户界面（UI）的结构和排列方式。Android 提供了多种布局容器，每种容器都有其特定的用途和特点。以下是 Android 中常用的布局容器：

  **1. LinearLayout（线性布局）**

- **特点**：将子视图按水平（horizontal）或垂直（vertical）方向依次排列。
- **常用属性**：
    - `android:orientation`：设置排列方向（`horizontal` 或 `vertical`）。
    - `android:layout_weight`：设置子视图的权重，用于分配剩余空间。
- **适用场景**：简单的线性排列，如表单、列表项等。



 **2. RelativeLayout（相对布局）**

- **特点**：子视图的位置是相对于父容器或其他子视图来确定的。

- **常用属性**：
    - `android:layout_alignParentTop`、`android:layout_alignParentBottom` 等：相对于父容器对齐。
    - `android:layout_toLeftOf`、`android:layout_below` 等：相对于其他子视图对齐。
    
- **适用场景**：需要复杂相对定位的布局。

- 参考代码：contact_item.xml

    

 **3. ConstraintLayout（约束布局）**

- **特点**：通过约束（Constraint）关系确定子视图的位置，功能强大且灵活。
- **常用属性**：
    - `app:layout_constraintTop_toTopOf`、`app:layout_constraintStart_toEndOf` 等：设置视图之间的约束关系。
    - `app:layout_constraintHorizontal_bias`：设置水平偏移比例。
- **适用场景**：复杂的 UI 设计，支持扁平化视图层次结构，性能较好。
- 没有嵌套布局，所有的部件都是ConstraintLayout的直接⼦
    部件。同样的布局，如果⽤LinearLayout，那只能互相嵌套了。之
    前说过，减少嵌套就能缩短布局绘制时间， ⼤⼤提⾼应⽤的⽤户体
    验  



 **4. FrameLayout（帧布局）**

- **特点**：子视图会堆叠在一起，默认从左上角开始排列。
- **常用属性**：
    - `android:layout_gravity`：设置子视图的对齐方式。
- **适用场景**：用于重叠视图的场景，如 Fragment 容器、遮罩层等。



 **5. TableLayout（表格布局）**

- **特点**：将子视图按行和列排列，类似于 HTML 中的表格。
- **常用属性**：
    - `android:stretchColumns`：设置可拉伸的列。
    - `android:shrinkColumns`：设置可收缩的列。
- **适用场景**：需要表格形式排列的布局，如数据表格。



 **6. GridLayout（网格布局）**

- **特点**：将子视图按网格形式排列，支持跨行和跨列。
- **常用属性**：
    - `android:rowCount`、`android:columnCount`：设置行数和列数。
    - `android:layout_rowSpan`、`android:layout_columnSpan`：设置跨行或跨列。
- **适用场景**：需要网格形式排列的布局，如图片墙、日历等。



 **7. CoordinatorLayout（协调布局）**

- **特点**：用于实现复杂的交互行为，如滑动隐藏、悬浮按钮等。
- **常用属性**：
    - `app:layout_behavior`：设置子视图的行为。
- **适用场景**：需要与用户交互（如滑动、动画）的复杂布局。



 **8. RecyclerView（回收视图）**

- **特点**：用于显示大量数据的列表或网格，支持高效回收和复用视图。
- **常用属性**：
    - `android:layoutManager`：设置布局管理器（LinearLayoutManager、GridLayoutManager 等）。
- **适用场景**：显示动态列表或网格数据，如聊天记录、图片库等。



 **9. ScrollView（滚动视图）**

- **特点**：用于包裹内容，当内容超出屏幕时支持垂直滚动。
- **常用属性**：
    - `android:fillViewport`：设置是否填充视口。
- **适用场景**：内容超出屏幕时需要滚动的布局。



 **10. HorizontalScrollView（水平滚动视图）**

- **特点**：类似于 ScrollView，但支持水平滚动。
- **适用场景**：内容超出屏幕时需要水平滚动的布局。



 **11. ViewStub（延迟加载视图）**

- **特点**：用于延迟加载布局，只有在需要时才加载。
- **适用场景**：优化性能，减少初始布局的复杂性。



 **12. FragmentContainerView（Fragment 容器视图）**

- **特点**：用于承载 Fragment 的专用容器，支持 Fragment 的生命周期管理。
- **适用场景**：基于 Fragment 的 UI 设计。





### Resource

#### drawable  

```
mdpi：中等像素密度屏幕（约160dpi）。
hdpi： ⾼像素密度屏幕（约240dpi）。
xhdpi：超⾼像素密度屏幕（约320dpi）。
xxhdpi：超超⾼像素密度屏幕（约480dpi）。
xxxhdpi：超超超⾼像素密度屏幕（约640dpi）。
```





#### String

```xml
转义符号 \
<string name="question_asia">Lake Baikal is the world\'s oldest and deepest
freshwater lake.</string>

占位符 %d
<string name="system_version">系统版本 %d</string>
```

### View

```
View 的工作流程主要是指 measure、layout、draw 这三大流程，即测量、布局和绘制,其中 measure 确定 View的测量宽/高，layout 确定 View的最终宽/高和四个顶点的位置，而draw 则将 View 绘制到屏幕上
```



### Style

**应用设计的局限就是想象力的局限**

#### Icon

```
创建定制图标。这需要针对不同屏幕显⽰密度或各种可能的设备配置，准备不同版本的图标
使⽤Android Studio内置的 Android Asset Studio⼯具，为应⽤栏创建或定制图⽚。
```

以下是各个 `mipmap` 目录下图标尺寸的表格展示：

| 目录              | 尺寸 (像素)  | 对应 DPI |
| ----------------- | ------------ | -------- |
| mipmap-mdpi       | 48x48        | 160 dpi  |
| mipmap-hdpi       | 72x72        | 240 dpi  |
| mipmap-xhdpi      | 96x96        | 320 dpi  |
| mipmap-xxhdpi     | 144x144      | 480 dpi  |
| mipmap-xxxhdpi    | 192x192      | 640 dpi  |
| mipmap-anydpi-v26 | 通常 192x192 | 任意 DPI |

这个表格清晰地展示了每个 `mipmap` 目录对应的图标尺寸和屏幕密度。

![](Images\自定义 Icon.png)

#### Theme

```xml
AppCompat库⾃ 带三⼤主题。
    Theme.AppCompat——深⾊主题。
    Theme.AppCompat.Light——浅⾊主题。
    Theme.AppCompat.Light.DarkActionBar——带深⾊⼯具栏的浅⾊主题。

<style name="Base.Theme.WeChart" parent="Theme.Material3.DayNight.NoActionBar"/>
<style name="Theme.LearnBook" parent="Theme.MaterialComponents.DayNight.DarkActionBar"/> 

colorPrimary 属性主要⽤于应⽤栏
colorPrimaryDark ⽤于屏幕顶部的状态
colorAccent EditText部件
<style name="AppTheme" parent="Theme.AppCompat">
    <item name="colorPrimary">@color/colorPrimaryred</item>
    <item name="colorPrimaryDark">@color/colorPrimaryDarkdark_red</item>
    <item name="colorAccent">@color/colorAccentgray</item>
</style>
```

```xml
<style name="BeatBoxTheme" parent="Theme.AppCompat">
    <!-- Copy our color theme attributes to the framework -->
    <item name="colorPrimary">@color/red</item>
    <item name="colorPrimaryDark">@color/dark_red</item>
    <item name="colorAccent">@color/gray</item>
    <item name="actionModeBackground">@color/red</item>
    <item name="android:windowBackground">@color/soothing_blue</item>
    <!--todo 没有使用 android命名空间，因为要覆盖的是appCompat的部分-->
    <item name="buttonStyle">@style/BeatBoxButton</item>
</style>


<style name="BeatBoxButton" parent="Widget.AppCompat.Button">
    <item name="android:background">@drawable/button_beat_box</item>
    <!-- todo 去除 patch 图片 折角的阴影动画 -->
    <!-- <item name="android:stateListAnimator">@null</item> -->
</style>

```



### Animation

#### View Animation

> Tween Animation（补间动画）  

```xml
<?xml version="1.0" encoding="utf-8"?>  
<set xmlns:android="http://schemas.android.com/apk/res/android"  
    android:duration="3000">  
    <translate  
        android:fromXDelta="0"  
        android:toXDelta="100%p"  
        android:fromYDelta="0"  
        android:toYDelta="0" />  
</set>
```

```java
Animation translateAnimation = AnimationUtils.loadAnimation(this, R.anim.translate_animation);  
view.startAnimation(translateAnimation);
```

> FrameAnimation（逐帧动画）  

```xml
<?xml version="1.0" encoding="utf-8"?>
<animation-list xmlns:android="http://schemas.android.com/apk/res/android" >
    <item android:drawable="@drawable/bird_one" android:duration="100"/>
    <item android:drawable="@drawable/bird_two" android:duration="100"/>
    <item android:drawable="@drawable/bird_three" android:duration="100"/>
    <item android:drawable="@drawable/bird_four" android:duration="100"/>
    <item android:drawable="@drawable/bird_five" android:duration="100"/>
    <item android:drawable="@drawable/bird_six" android:duration="100"/>
    <item android:drawable="@drawable/bird_seven" android:duration="100"/>
    <item android:drawable="@drawable/bird_eight" android:duration="100"/>
</animation-list>
```

```java
public void frameAnim(View view) {
    v.setBackgroundResource(R.drawable.frame_animation);
    AnimationDrawable frameAnimation = (AnimationDrawable) v.getBackground();
    frameAnimation.start();
    //frameAnimation.stop();
}
```

#### Property Animation

![](Images\Property Animation 流程.png)

```
先通过插值器产生当前进度的百分比，然后再经过 Evaluator 生成对应百分比所对应的数字值。
```



> ValueAnimator  



> ObjectAnimator 



> PropertyValuesHolder  



> ViewPropertyAnimator  

```java
public void attrAnim(View view) {
    // 创建属性动画对象，指定要动画化的属性（这里是translationX）
    ObjectAnimator animator = ObjectAnimator.ofFloat(v, "translationX", 0f, 300f);

    // 设置动画时长
    animator.setDuration(2000);

    // 设置插值器，这里使用加速减速插值器
    animator.setInterpolator(new AccelerateDecelerateInterpolator());

    // 动画重复次数，设置为-1表示无限重复
    animator.setRepeatCount(ValueAnimator.INFINITE);

    // 设置动画重复模式，这里设置为反向重复
    animator.setRepeatMode(ValueAnimator.REVERSE);

    // 启动动画
    animator.start();
}
```

```

```



#### ViewGroup Animation

```xml
android:animateLayoutChanges="true"
```

```kotlin
private void addButtonView() {
    i++;
    Button button = new Button(this);
    button.setText("button" + i);
    LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.
    LayoutParams.WRAP_CONTENT,ViewGroup.LayoutParams.WRAP_CONTENT);
    button.setLayoutParams(params);
    linearLayoutContainer.addView(button, 0);
}
```





### ORM

#### Room

> LiveData 后台数据处理

```markdown
1.在Room DAO⾥配置查询返回 LiveData
2.Room ⾃动在后台线程上执⾏查询操作，完成后会把结果数据发布到LiveData对象
3.配置 activity 或 fragment 来观察⽬标LiveData对象
4.被观察的LiveData⼀准备就绪，activity 或 fragment 就会在主线程上收到结果通知
```



```kotlin
class CrimeTypeConverters {
    @TypeConverter
    fun fromDate(date: Date?): Long? {
        return date?.time
    }

    @TypeConverter
    fun toDate(millisSinceEpoch: Long?): Date? {
        return millisSinceEpoch?.let {
            Date(it)
        }
    }

    @TypeConverter
    fun toUUID(uuid: String?): UUID? {
        return UUID.fromString(uuid)
    }

    @TypeConverter
    fun fromUUID(uuid: UUID?): String? {
        return uuid?.toString()
    }
}

class CrimeRepository private constructor(context: Context) {
    private val mDataBase: CrimeDatabase =
        Room.databaseBuilder(
            context.applicationContext,
            CrimeDatabase::class.java,
            DATABASE_NAME
        )
            //add database version upgrade
            .addMigrations(migration_1_2)
            .addMigrations(migration_2_3)
            .build()

    private val mCrimeDao = mDataBase.crimeDao()
}

@Database(entities = [Crime::class], version = 3)
@TypeConverters(CrimeTypeConverters::class)
abstract class CrimeDatabase : RoomDatabase() {
    abstract fun crimeDao(): CrimeDao
}


```

```kotlin
//使用 Transformations.switchMap 将 crimeIdLiveData 的变化映射到 crimeRepository.getCrime(crimeId) 的返回值。

//当 crimeIdLiveData 的值发生变化时，switchMap 会自动调用 crimeRepository.getCrime(crimeId)，并将结果作为新的 LiveData 返回。

//这样，crimeLiveData 会自动更新，无需手动触发。

class CrimeDetailViewModel() : ViewModel() {

    private val crimeRepository = CrimeRepository.get()
    private val crimeIdLiveData = MutableLiveData<UUID>()

    var crimeLiveData: LiveData<Crime?> =
        Transformations.switchMap(crimeIdLiveData) { crimeId ->
            crimeRepository.getCrime(crimeId)
        }

    fun loadCrime(crimeId: UUID) {
        crimeIdLiveData.value = crimeId
    }
}
```

### Menu

```xml
<menu xmlns:android="http://schemas.android.com/apk/res/android"
xmlns:app="http://schemas.android.com/apk/res-auto">
<item 
	android:id="@+id/new_crime"
    android:icon="@android:drawable/ic_menu_add"
    android:title="@string/new_crime"
    app:showAsAction="ifRoom|withText"/>
</menu>
```

### ContentProvider  

#### FileProvider  

> 相册图片文件



### Network

#### IPC

![image-20250224093326808](./images/IPC.png)

#### Http

##### Okhttp3

```kotlin
 private fun fetchBaiduImage(keyword: String) {
     val client = OkHttpClient()
     val url = "https://image.baidu.com/search/acjson?tn=resultjson_com&queryWord=$keyword&rn=1&ie=utf-8&oe=utf-8"

     val request = Request.Builder()
     .url(url)
     .build()

     client.newCall(request).enqueue(object : okhttp3.Callback {
         override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
             if (response.isSuccessful) {
                 val jsonData = response.body()?.string()
                 Log.e(TAG, "${jsonData}")
                 //                    jsonData?.let { parseJson(it) }
             }
         }

         override fun onFailure(call: okhttp3.Call, e: IOException) {
             Log.e(TAG, "Error fetching image: ${e.message}")
         }
     })
 }
```



##### Retrofit

```json
dependencies {
    ...
    implementation 'com.squareup.retrofit2:retrofit:2.5.0'
    implementation 'com.squareup.retrofit2:converter-scalars:2.5.0'
}
```

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

```kotlin
// Http Get 请求调用堆栈
class FlickrApi
@GET("api/users")
fun searchUsers(@Query("text") query: String): Call<PhotoResponse> --> flickrRequest

flickrRequest.enqueue...
1.异步请求：enqueue 方法用于将网络请求放入队列中，以异步方式执行。这意味着在发起请求后，程序不会阻塞，仍然可以继续执行后续代码。
2.回调处理：请求完成后，结果会通过回调接口返回，通常是 onResponse 和 onFailure 方法
```

```kotlin

// Http Get 获取缩略图-调用堆栈
ThumbnailDownloader

fun onLooperPrepared()

mRequestHandler.obtainMessage(MESSAGE_DOWNLOAD, target).sendToTarget()

mRequestHandler
onLooperPrepared
	-> handleMessage
		-> handleRequest
			-> fetchPhoto

// Http Get 点击显示大图-调用堆栈
interface GalleryClick {
    fun onGalleryClick(item: GalleryItem?)
}

class PhotoListAdapter(mGalleryClick, mThumbnailDownloader){
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PhotoListHolder {
       ...
       val holder = PhotoListHolder(view)
       holder.mGalleryClick = galleryClick
       return holder
    }
}

class PhotoListHolder(itemView: View) :View.OnClickListener {
	override fun onClick(v: View?) {
        mGalleryClick?.onGalleryClick(mGallery)
    }
}

private val mGalleryClick: GalleryClick = object : GalleryClick {
    override fun onGalleryClick(item: GalleryItem?) {
        item ?: return
        findNavController().navigate(
            PhotoGalleryNavFragmentDirections.actionPhotoGalleryNavFragmentToPhotoPageNavFragment(
                item.mPhotoPageUri))
        }
    }
}
```



### Test

Ctrl+Shift+T  

```
// 以@Before注解的包含公共代码的函数会在所有测试之前运⾏⼀次
```

### Web

```xml
// 开启网络权限
<uses-permission android:name="android.permission.INTERNET" />
// 开启明文流量
android:usesCleartextTraffic="true"
```



#### WebBrowser

```kotlin
class PhotoGalleryFragment : VisibleFragment() {
...
    private inner class PhotoHolder(private val itemImageView:ImageView) : RecyclerView.ViewHolder(itemImageView),View.OnClickListener
    {
        private lateinit var galleryItem: GalleryItem
        init {
            itemView.setOnClickListener(this)
        }
        val bindDrawable: (Drawable) -> Unit = itemImageView::setImageDrawable
        fun bindGalleryItem(item: GalleryItem) {
            galleryItem = item
        }
        override fun onClick(view: View) {
            val intent = Intent(Intent.ACTION_VIEW, galleryItem.photoPageUri)
            startActivity(intent)
        }
    }
...
}
```

```kotlin

```

#### WebView

```kotlin
override fun onCreateView(
    inflater: LayoutInflater,
    container: ViewGroup?,
    savedInstanceState: Bundle?
): View? {
    return inflater.inflate(R.layout.fragment_photo_page, container, false)
}
```

```kotlin
@SuppressLint("SetJavaScriptEnabled")
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    mWebView = view.findViewById(R.id.webView)
    val progressBar: ProgressBar = view.findViewById(R.id.progress_horizontal)
    mWebView.settings.javaScriptEnabled = true
    mWebView.webViewClient = WebViewClient()
    mWebView.webChromeClient = object : WebChromeClient() {
        override fun onProgressChanged(view: WebView?, newProgress: Int) {
            super.onProgressChanged(view, newProgress)
            if (newProgress == 100) {
                progressBar.visibility = View.GONE
            } else {
                progressBar.progress = newProgress
                progressBar.visibility = View.VISIBLE
            }
        }

        override fun onReceivedTitle(view: WebView?, title: String?) {
            super.onReceivedTitle(view, title)
            val appCompatActivity = requireActivity() as AppCompatActivity
            appCompatActivity.supportActionBar?.subtitle = title
        }
    }
    mWebView.loadUrl(mUri.toString())
}
```



### Project

```markdown
https://github.com/android/views-widgets-samples
```

### Book

```markdown
《Android 第一行代码(第2版).pdf》
Code\FisrtLineCode\chapter10\ServiceBestPractice 断点下载
```





### Android SDK  版本与兼容

将⾼API级别代码置于检查Android设备版本的条件语句中  

| **JDK 版本** | **Gradle 插件版本** | **Android API 级别** | **Android 版本（固件）** | **Android Studio 版本**     |
| :----------- | :------------------ | :------------------- | :----------------------- | :-------------------------- |
| JDK 6        | 1.0.0 - 2.3.3       | API 14 - 23          | Android 4.0 - 6.0        | 1.0 - 2.3                   |
| JDK 7        | 2.3.3 - 3.0.0       | API 23 - 26          | Android 6.0 - 8.0        | 2.3 - 3.0                   |
| JDK 8        | 3.0.0 - 4.2.2       | API 26 - 30          | Android 8.0 - 11         | 3.0 - 4.2                   |
| JDK 11       | 4.2.2 - 7.0.0       | API 30 - 31          | Android 11 - 12          | 4.2 - 2020.3.1 (Arctic Fox) |
| JDK 17       | 7.0.0 及以上        | API 31 及以上        | Android 12 及以上        | 2021.1.1 (Bumblebee) 及以上 |

 **Android API 级别与 Android 版本对应表**

| **Android API 级别** | **Android 版本（固件）** | **版本代号**       | **发布日期**  |
| :------------------- | :----------------------- | :----------------- | :------------ |
| API 34               | Android 14               | Upside Down Cake   | 2023 年 10 月 |
| API 33               | Android 13               | Tiramisu           | 2022 年 8 月  |
| API 32               | Android 12L              | Snow Cone (SV2)    | 2022 年 3 月  |
| API 31               | Android 12               | Snow Cone          | 2021 年 10 月 |
| API 30               | Android 11               | Red Velvet Cake    | 2020 年 9 月  |
| API 29               | Android 10               | Q                  | 2019 年 9 月  |
| API 28               | Android 9                | Pie                | 2018 年 8 月  |
| API 27               | Android 8.1              | Oreo               | 2017 年 12 月 |
| API 26               | Android 8.0              | Oreo               | 2017 年 8 月  |
| API 25               | Android 7.1              | Nougat             | 2016 年 12 月 |
| API 24               | Android 7.0              | Nougat             | 2016 年 8 月  |
| API 23               | Android 6.0              | Marshmallow        | 2015 年 10 月 |
| API 22               | Android 5.1              | Lollipop           | 2015 年 3 月  |
| API 21               | Android 5.0              | Lollipop           | 2014 年 11 月 |
| API 20               | Android 4.4W             | KitKat Wear        | 2014 年 6 月  |
| API 19               | Android 4.4              | KitKat             | 2013 年 10 月 |
| API 18               | Android 4.3              | Jelly Bean         | 2013 年 7 月  |
| API 17               | Android 4.2              | Jelly Bean         | 2012 年 11 月 |
| API 16               | Android 4.1              | Jelly Bean         | 2012 年 7 月  |
| API 15               | Android 4.0.3            | Ice Cream Sandwich | 2011 年 12 月 |
| API 14               | Android 4.0              | Ice Cream Sandwich | 2011 年 10 月 |

**Gradle 插件版本与 Gradle 版本对应表**

| **Gradle 插件版本** | **Gradle 版本** | **支持的最低 JDK 版本** |
| :------------------ | :-------------- | :---------------------- |
| 8.0.0 及以上        | 8.0 及以上      | JDK 17                  |
| 7.0.0 - 7.4.0       | 7.0 - 7.5       | JDK 11                  |
| 4.2.0 - 6.9.0       | 6.7.1 - 7.0     | JDK 8                   |
| 3.0.0 - 4.1.0       | 4.1 - 6.7.1     | JDK 7                   |
| 2.3.0 - 2.9.0       | 2.14.1 - 4.1    | JDK 6                   |
| 1.0.0 - 2.2.0       | 2.2.1 - 2.14.1  | JDK 6                   |

### 快捷键

| 快捷键                       | 说明                       |
| ---------------------------- | -------------------------- |
| 双击shift                    | 弹出搜索面板               |
| ctrl + E                     | 最近打开的文件             |
| shift +F6                    | 重命名                     |
| alt + 鼠标                   | 批量修改                   |
| ctrl +D                      | 向下复制一行               |
| Ctrl + alt +M                | 抽取方法                   |
| .var  或者 ctrl + alt + v    | 快速生成变量               |
| ctrl + F                     | 当前文件搜索               |
| ctrl +shift + F              | 全局搜索                   |
| ctrl + R 和 ctrl + shift + R | 当前文件搜索替换、全局替换 |
| ctrl + alt + o               | 清除无效导包               |
| ctrl + alt + L               | 格式化代码                 |
| ctrl + 鼠标 或者 alt + F7    | 查找使用                   |
| ctrl + alt + 左右            | 代码前进后退               |
| ctrl + alt + T               | try catch                  |
| ctrl + P                     | 方法参数提示               |
| Ctrl+F8                      | 启⽤和禁⽤断点             |
