package be.moneyMaker.util.file;

import java.io.*;

/**
 * Created by florian on 21/09/14.
 */
public class FileFunction {

    public static void save(final String text, final String path, final String name, boolean erase) {

        //Logger.info("Try to save " + name + " at " + path + ".. ");

        final String nameFile = path + name;

        final File file = new File(nameFile);

        if (!file.exists() || erase == true) {

            if (!file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            try {
                file.createNewFile();
                //System.out.println("saved !");
            } catch (final IOException e) {
                //System.out.println("file no created");
            }

            file.setWritable(true);
            file.setReadable(true);
            try {
                //final PrintWriter out = new PrintWriter(new FileWriter(nameFile), true);
                Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(nameFile), "UTF-8"));

                out.write(text);

                out.close();
            } catch (final Exception e) {
                e.printStackTrace();
            }
        }

    }
}
