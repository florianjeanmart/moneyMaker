package be.moneyMaker.dto.external.Serializer.frequency;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import be.moneyMaker.util.enums.Frequency;

import java.io.IOException;

/**
 * Created by florian on 31/08/14.
 */
public class FrequencyDeserialize extends JsonDeserializer<Frequency>{

	@Override
	public Frequency deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {

		final String jsonValue = jp.getText();
		for (final Frequency frequency : Frequency.values())
		{
			if (frequency.toString().equals(jsonValue))
			{
				return frequency;
			}
		}
		return null;
	}
}
