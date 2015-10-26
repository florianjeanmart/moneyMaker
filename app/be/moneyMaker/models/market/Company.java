package be.moneyMaker.models.market;

import be.moneyMaker.models.AuditedAbstractEntity;

import javax.persistence.*;

/**
 * Created by florian on 14/09/14.
 */
@Entity
@NamedQueries({
        @NamedQuery(name = Company.FIND_BY_SYMBOL, query = "where symbol = :symbol"),
        @NamedQuery(name = Company.SERACH_BY_SYMBOL_OR_NAME, query = "WHERE symbol LIKE \"%\":content\"%\" OR name LIKE \"%\":content\"%\" "),
})
public class Company extends AuditedAbstractEntity{

    public static final String FIND_BY_SYMBOL = "COMPANY_FIND_BY_SYMBOL";
    public static final String SERACH_BY_SYMBOL_OR_NAME = "Company_SERACH_BY_SYMBOL_OR_NAME";
    @Id
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false, unique = true)
	private String symbol;

	@Column(nullable = false)
	@ManyToOne(cascade = {CascadeType.MERGE})
	private Industry industry;

	public Company() {
	}


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSymbol() {
		return symbol;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

	public Industry getIndustry() {
		return industry;
	}

	public void setIndustry(Industry industry) {
		this.industry = industry;
	}

    @Override
    public String toString() {
        return "Company{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", symbol='" + symbol + '\'' +
                ", industry=" + industry +
                '}';
    }
}
