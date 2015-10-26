package be.moneyMaker.dto.external.Serializer.frequency;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import be.moneyMaker.util.enums.Frequency;

import java.io.IOException;

/**
 * Created by florian on 31/08/14.
 */
public class FrequencySerializer extends JsonSerializer<Frequency>{

	@Override
	public void serialize(Frequency value, JsonGenerator jgen, SerializerProvider provider) throws IOException, JsonProcessingException {

		jgen.writeString(value.toString());


	}



}
