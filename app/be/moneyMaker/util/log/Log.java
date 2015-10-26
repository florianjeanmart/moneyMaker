package be.moneyMaker.util.log;

import be.moneyMaker.util.file.FileFunction;
import play.Logger;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by florian on 21/09/14.
 */
public class Log {

    private List<String> stringList = new ArrayList<>();

    public void addEntry(String s){
        Logger.info(s);
        stringList.add(s);
    }

    public void print(String name){

        String content = "";

        for(String s : stringList){
            content+=s+"\n";
        }

        content = content.replaceAll("%20"," ");

        content = content.replaceAll("%22","\"");

        FileFunction.save(content,"file/logs/",name,true);
    }
}
