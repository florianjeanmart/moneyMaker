package be.moneyMaker.dto.external.Serializer.frequency;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.util.List;

/**
 * Created by florian on 31/08/14.
 */
public class ListDeserialize extends JsonDeserializer<List<?>> {

	@Override
	public List<?> deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
/*
		try {
			return jp.readValueAs(List.class);
		} catch (IllegalStateException e) {
			Industry i =  jp.readValueAs(Industry.class);
			List<Industry> list = new ArrayList<>();
			list.add(i);
			return list;
		}*/
		return jp.readValueAs(List.class);
	}
}
