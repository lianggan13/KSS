## Android


### Thread

```java
 runOnUiThread(() -> contentTv.setText(e.getMessage()));
```



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
```

> 设备配置改变: 应⽤屏旋转、窗口⼤⼩调整 、夜间模式切换  

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



### RecyclerView  

![](Images\RecyclerView+Adapter+ViewHolder.png)

```kotlin
override fun onCreateView(inflater: LayoutInflater,container: ViewGroup?,savedInstanceState: Bundle?
): View? {
    val view = inflater.inflate(R.layout.fragment_crime_list, container, false)
    crimeRecyclerView = view.findViewById(R.id.crime_recycler_view) as RecyclerView
    crimeRecyclerView.layoutManager = LinearLayoutManager(context)
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



### Jetpack  AndroidX 

```json
foundation、 architecture、 behavior、UI

architecture component(架构组件): ViewModel、Room、Data Binding、WorkManager
foundation：AppCompat、Test、Android KTX
behavior：Notification
UI：Fragment、Layout
```





### Layout

```
match_parent：视图与其⽗视图⼤⼩相同。
wrap_content：视图将根据其显⽰内容⾃ 动调整⼤⼩。

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



### Style

**应用设计的局限就是想象力的局限**

#### Icon

```
创建定制图标。这需要针对不同屏幕显⽰密度或各种可能的设备配置，准备不同版本的图标
使⽤Android Studio内置的 Android Asset Studio⼯具，为应⽤栏创建或定制图⽚。
```



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

#### 线性动画

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

#### 帧动画

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

#### 属性动画

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

### ORM

#### Room

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

### Test

Ctrl+Shift+T  

```
// 以@Before注解的包含公共代码的函数会在所有测试之前运⾏⼀次
```



### Android 依赖

```
implementation 'androidx.lifecycle:lifecycle-extensions:2.2.0'

implementation 'androidx.appcompat:appcompat:1.4.1'
implementation 'com.google.android.material:material:1.5.0'
implementation 'androidx.constraintlayout:constraintlayout:2.1.3'

implementation "androidx.lifecycle:lifecycle-extensions:2.2.0"

implementation 'androidx.recyclerview:recyclerview:1.2.1'

implementation 'androidx.core:core-ktx:1.7.0'
implementation 'androidx.room:room-runtime:2.4.2'
kapt 'androidx.room:room-compiler:2.4.2'
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
