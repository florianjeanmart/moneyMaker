package be.moneyMaker.dto.external.Quandl;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import be.moneyMaker.dto.DTO;
import be.moneyMaker.util.enums.Frequency;

import java.util.Date;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import be.moneyMaker.dto.external.Serializer.frequency.FrequencyDeserialize;
import be.moneyMaker.dto.external.Serializer.frequency.FrequencySerializer;

/**
 * Created by florian on 31/08/14.
 */
public class QuandLDTO extends DTO{

	private String error;

	private Long id;

	@JsonProperty("source_id")
	private Long sourceId;

	@JsonProperty("source_code")
	private String sourceCode;

	@JsonProperty("source_name")
	private String sourceName;

	private String code;

	private String name;

	@JsonProperty("urlize_name")
	private String urlizeName;

	private String description;

	@JsonProperty("updated_at")
	private Date updatedAt;

	@JsonProperty("created_at")
	private Date createdAt;

	@JsonSerialize(using = FrequencySerializer.class)
	@JsonDeserialize(using = FrequencyDeserialize.class)
	private Frequency frequency;

	@JsonProperty("display_url")
	private String displayUrl;

	@JsonProperty("from_date")
	private Date fromDate;

	@JsonProperty("to_date")
	private Date toDate;

	@JsonProperty("column_names")
	private List<String> columnNames;

	@JsonProperty(value = "private")
	private Boolean privateStatus;

	private String type;

	private Boolean premium;

	public QuandLDTO() {
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getSourceId() {
		return sourceId;
	}

	public void setSourceId(Long sourceId) {
		this.sourceId = sourceId;
	}

	public String getSourceCode() {
		return sourceCode;
	}

	public void setSourceCode(String sourceCode) {
		this.sourceCode = sourceCode;
	}

	public String getSourceName() {
		return sourceName;
	}

	public void setSourceName(String sourceName) {
		this.sourceName = sourceName;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUrlizeName() {
		return urlizeName;
	}

	public void setUrlizeName(String urlizeName) {
		this.urlizeName = urlizeName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Frequency getFrequency() {
		return frequency;
	}

	public void setFrequency(Frequency frequency) {
		this.frequency = frequency;
	}

	public String getDisplayUrl() {
		return displayUrl;
	}

	public void setDisplayUrl(String displayUrl) {
		this.displayUrl = displayUrl;
	}

	public Date getFromDate() {
		return fromDate;
	}

	public void setFromDate(Date fromDate) {
		this.fromDate = fromDate;
	}

	public Date getToDate() {
		return toDate;
	}

	public void setToDate(Date toDate) {
		this.toDate = toDate;
	}

	public List<String> getColumnNames() {
		return columnNames;
	}

	public void setColumnNames(List<String> columnNames) {
		this.columnNames = columnNames;
	}

	public Boolean getPrivateStatus() {
		return privateStatus;
	}

	public void setPrivateStatus(Boolean privateStatus) {
		this.privateStatus = privateStatus;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Boolean getPremium() {
		return premium;
	}

	public void setPremium(Boolean premium) {
		this.premium = premium;
	}

	@Override
	public String toString() {
		return "QuandLDTO{" +
				"error='" + error + '\'' +
				", id=" + id +
				", sourceId=" + sourceId +
				", sourceCode='" + sourceCode + '\'' +
				", sourceName='" + sourceName + '\'' +
				", code='" + code + '\'' +
				", name='" + name + '\'' +
				", urlizeName='" + urlizeName + '\'' +
				", description='" + description + '\'' +
				", updatedAt=" + updatedAt +
				", createdAt=" + createdAt +
				", frequency=" + frequency +
				", displayUrl='" + displayUrl + '\'' +
				", fromDate=" + fromDate +
				", toDate=" + toDate +
				", columnNames=" + columnNames +
				", privateStatus=" + privateStatus +
				", type='" + type + '\'' +
				", premium=" + premium +
				'}';
	}
}
