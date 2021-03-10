package io.tensevntysevn.friends.witzy

import android.os.Bundle

import com.getcapacitor.BridgeActivity
import com.getcapacitor.Plugin

import com.getcapacitor.community.audio.NativeAudio
import com.getcapacitor.community.keepawake.KeepAwake

import java.util.ArrayList

class MainActivity:BridgeActivity() {
  fun onCreate(savedInstanceState:Bundle) {
    super.onCreate(savedInstanceState)
    // Initializes the Bridge
    this.init(savedInstanceState, object:ArrayList<Class<out Plugin>>() {
      init{
        // Additional plugins you've installed go here
        // Ex: add(TotallyAwesomePlugin.class);
        add(NativeAudio::class.java)
        add(KeepAwake::class.java)
      }
    })
  }
}
