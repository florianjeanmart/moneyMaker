import play.Project._
import sbt.Keys._
import sbt._


object ApplicationBuild extends Build {

  lazy val buildVersion = "2.2.4"
  lazy val playVersion = "2.2.4"

  val appName = "moneyMaker"
  val appVersion = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    javaCore,
    javaJdbc,
    javaJpa,
    cache,
    javaEbean,
    "com.google.inject" % "guice" % "3.0" % "test",
    "org.xhtmlrenderer" % "core-renderer" % "R8",
    "net.sf.jtidy" % "jtidy" % "r938",
    "org.apache.commons" % "commons-email" % "1.3.1",
    "commons-io" % "commons-io" % "2.3",
    "com.googlecode.ehcache-spring-annotations" % "ehcache-spring-annotations" % "1.2.0",
    "com.google.inject" % "guice" % "3.0" % "test",
    "com.google.guava" % "guava" % "14.0",
    "mysql" % "mysql-connector-java" % "5.1.18",
    "de.neuland-bfi" % "jade4j" % "0.4.0",
    "org.apache.commons" % "commons-lang3" % "3.1","com.liferay" % "org.apache.commons.fileupload" % "1.2.2.LIFERAY-PATCHED-1",
    "com.google.code.maven-play-plugin.com.github.yeungda.jcoffeescript" % "jcoffeescript" % "1.0",
    "com.fasterxml.jackson.core" % "jackson-databind" % "2.2.2"
  )

  lazy val angularCompileTask = TaskKey[Unit]("angular-compile", "Compile angular app")
  val angularCompileSettings = angularCompileTask := {
    new AngularCompileTask().execute()
  }

  val main = play.Project(appName, appVersion, appDependencies)
    .settings(
      angularCompileSettings, resources in Compile <<= (resources in Compile).dependsOn(angularCompileTask)
    )

  javaOptions ++= Seq("-Xmx512M", "-Xmx2048M", "-XX:MaxPermSize=2048M");

}